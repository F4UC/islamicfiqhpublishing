/**
 * Gate ijazah graph data to active FIQH+ / PRO. Catalog (index.json, sources.json)
 * stays public (teaser); only graphs/<gid>.json is gated. Reads the file via env.ASSETS,
 * which bypasses _middleware's block, so the raw file is unreachable by the public but
 * still serveable here after the entitlement check.
 */
import { verifyUserBySession } from '../../_lib/auth.js';

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
        WHERE s.user_id = ? AND s.status = 'active'
          AND datetime(s.current_period_end) > datetime('now')
          AND pg.work_id = 'ijazah' LIMIT 1`
    ).bind(uid).first();
    return !!row;
  } catch (e) { return false; }
}

// ---- resolve the signed-in user from our first-party session cookie (Phase 2
// cutover; was Clerk JWT). Returns the userId string or null; never throws. ----
async function verifyUser(request, env) {
  const r = await verifyUserBySession(env, request);
  return r ? r.userId : null;
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
