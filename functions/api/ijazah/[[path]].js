/**
 * Gate ijazah graph data to active FIQH+ / PRO. Catalog (index.json, sources.json)
 * stays public (teaser); only graphs/<gid>.json is gated. Reads the file via env.ASSETS,
 * which bypasses _middleware's block, so the raw file is unreachable by the public but
 * still serveable here after the entitlement check.
 */
import { createClerkClient } from '@clerk/backend';

export async function onRequest(context) {
  const { request, env, params } = context;
  const segs = (params.path || []).filter(Boolean);   // e.g. ['graph','ijaza_shafii.json']
  if (segs[0] !== 'graph' || !segs[1]) return json({ ok:false, error:'not_found' }, 404);

  const file = segs.slice(1).join('/');               // 'ijaza_shafii.json'
  if (!/^[a-zA-Z0-9_-]+\.json$/.test(file))           // strict: one <gid>.json, no subdirs/traversal
    return json({ ok:false, error:'bad_path' }, 400);

  if (!env || !env.DB)  return json({ ok:false, error:'db_not_configured' }, 503);
  if (!env.ASSETS)      return json({ ok:false, error:'assets_unavailable' }, 503);

  const uid = await verifyUser(request, env);          // null = guest
  const ok  = await hasIjazah(env.DB, uid);            // active FIQH+/PRO grant for 'ijazah'
  if (!ok) {
    return json({ ok:false, locked:true, tier: uid ? 'free' : 'guest', work:'ijazah' }, 403);
  }

  const assetUrl = new URL('/pages/tools/ijazah-data/graphs/' + file, request.url);
  const res = await env.ASSETS.fetch(new Request(assetUrl.toString(), { method:'GET' }));
  if (!res.ok) return json({ ok:false, error:'not_found' }, 404);
  return new Response(await res.text(), {
    status: 200,
    headers: { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'private, no-store' }
  });
}

// active FIQH+/PRO grant for work 'ijazah'? fail-safe = false (locked) on any error.
async function hasIjazah(DB, uid) {
  if (!uid) return false;
  try {
    const row = await DB.prepare(
      `SELECT 1 AS ok FROM subscriptions s JOIN plan_grants pg ON pg.plan_id = s.plan_id
        WHERE s.clerk_user_id = ? AND s.status = 'active'
          AND datetime(s.current_period_end) > datetime('now')
          AND pg.work_id = 'ijazah' LIMIT 1`
    ).bind(uid).first();
    return !!row;
  } catch (e) { return false; }
}

// ---- shared: verify Clerk JWT → userId or null (NEVER throws, NEVER 401s) ----
// COPIED VERBATIM from functions/api/tm/[[path]].js (short-term duplication — flagged
// as debt; consolidate into a shared module later).
async function verifyUser(request, env) {
  if (!env || !env.CLERK_SECRET_KEY || !env.CLERK_PUBLISHABLE_KEY) return null;
  try {
    const clerk = createClerkClient({
      secretKey: env.CLERK_SECRET_KEY,
      publishableKey: env.CLERK_PUBLISHABLE_KEY,
    });
    // Env-driven allowed origins so preview/custom domains verify without a code
    // change; falls back to the production origin only.
    const authorizedParties = (env.CLERK_AUTHORIZED_PARTIES
      ? env.CLERK_AUTHORIZED_PARTIES.split(',').map((s) => s.trim()).filter(Boolean)
      : ['https://islamicfiqhpublishing.com']);
    const state = await clerk.authenticateRequest(request, { authorizedParties });
    // `isAuthenticated` is current; `isSignedIn` is the older alias.
    const signedIn = state && (state.isAuthenticated ?? state.isSignedIn);
    if (!signedIn) return null;
    const auth = state.toAuth();
    return (auth && auth.userId) || null;
  } catch (e) {
    return null;
  }
}

// COPIED VERBATIM from functions/api/tm/[[path]].js.
function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
