/**
 * Gated Time Machine API — functions/api/tm/[[path]].js
 *
 * Catch-all for /api/tm/* :
 *   - /api/tm/whoami        STEP 1 identity self-check (unchanged):
 *                             valid token -> 200 { userId }; missing/invalid -> 401.
 *   - /api/tm/year/:y       STEP 2 metered entitlement (this PR):
 *                             ALWAYS 200 (never 401). Returns the year's events,
 *                             stubbed when the caller isn't entitled.
 *   - /api/tm/search        PR-C (not yet).
 *
 * Entitlement model (al-bidayah = the Time Machine timeline product):
 *   - HIJRI is fully fiqh-gated: a year is unlocked only if the request is
 *     LOGGED IN and (year <= works.free_until_year['al-bidayah'] (=11, the
 *     Prophetic-era teaser) OR an active subscription grants 'al-bidayah').
 *   - Guest (no token) => every year is a locked-stub (200, not an error).
 *   - Locked year => each event keeps `title` + each account's byte-exact
 *     `arabicExcerpt` teaser; the Thai `detail` (the paid moat) is STRIPPED.
 *   - `meta.authed` lets the front-end pick the popup (register vs upgrade).
 *
 * Secrets/bindings (per Cloudflare Pages environment, never committed):
 *   CLERK_SECRET_KEY (secret) + CLERK_PUBLISHABLE_KEY (non-secret) + D1 binding `DB`.
 *   @clerk/backend runs on the Workers runtime.
 */
import { createClerkClient } from '@clerk/backend';

const DATA_BASE = '/pages/tools/timemachine-data/';
const BIDAYAH_WORK = 'al-bidayah';     // the Time Machine timeline's product id
const FALLBACK_FREE_UNTIL = 11;        // used only if the works row is missing

export async function onRequest(context) {
  const { request, env, params } = context;
  const segs = Array.isArray(params.path) ? params.path : (params.path ? [params.path] : []);
  const route = segs.join('/');

  if (route === 'whoami') return handleWhoami(request, env);
  if (segs[0] === 'year' && segs[1]) return handleYear(request, env, segs[1]);
  // '/search' => PR-C
  return json({ ok: false, error: 'not_found' }, 404);
}

// ---- STEP 1 identity (unchanged behaviour) ----
async function handleWhoami(request, env) {
  if (!env || !env.CLERK_SECRET_KEY || !env.CLERK_PUBLISHABLE_KEY) {
    return json({ ok: false, error: 'auth_not_configured' }, 503);
  }
  const uid = await verifyUser(request, env);
  if (!uid) return json({ ok: false, error: 'unauthorized' }, 401);
  return json({ ok: true, userId: uid }, 200);
}

// ---- shared: verify Clerk JWT → userId or null (NEVER throws, NEVER 401s) ----
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

// ---- STEP 2: metered year endpoint (never 401 — Guests get stubs) ----
async function handleYear(request, env, yearRaw) {
  const year = parseInt(yearRaw, 10);
  if (!Number.isInteger(year) || year < 1) return json({ ok: false, error: 'bad_year' }, 400);
  if (!env || !env.DB) return json({ ok: false, error: 'db_not_configured' }, 503);

  const uid = await verifyUser(request, env);          // null = Guest (not logged in)
  const ent = await loadEntitlement(env.DB, uid);      // { freeUntil:Map, subWorks:Set }

  const shard = await readShard(request, year);
  if (!shard) return json({ ok: false, error: 'year_not_found' }, 404);

  const freeUntil = ent.freeUntil.has(BIDAYAH_WORK) ? ent.freeUntil.get(BIDAYAH_WORK) : FALLBACK_FREE_UNTIL;
  // Guest (no login) is ALWAYS locked. FIQH member: free years 1..freeUntil;
  // FIQH+ (active sub granting al-bidayah): every year.
  const unlocked = !!uid && ((year <= freeUntil) || ent.subWorks.has(BIDAYAH_WORK));

  let events = Array.isArray(shard.events) ? shard.events : [];
  if (!unlocked) events = events.map(stubEvent);

  const meta = Object.assign({}, shard.meta, { yearLocked: !unlocked, authed: !!uid, freeUntilYear: freeUntil });
  return json({ ok: true, year, meta, events }, 200);
}

// Locked-stub: keep title + arabicExcerpt teaser (byte-exact, already public on
// Shamela); STRIP the Thai `detail` (the moat).
function stubEvent(ev) {
  return {
    id: ev.id, hijriYear: ev.hijriYear, title: ev.title, locked: true,
    accounts: (ev.accounts || []).map((a) => ({
      source: a.source, arabicExcerpt: a.arabicExcerpt, loc: a.loc, url: a.url,
    })),
    upsellPlan: 'plan-bidayah',
  };
}

// Same-origin fetch of the static shard (MVP). At lockdown: swap to ASSETS/R2.
async function readShard(request, year) {
  const url = new URL(DATA_BASE + 'bidayah-h' + year + '.json', request.url);
  const r = await fetch(url.toString(), { cf: { cacheTtl: 300 } });
  if (!r.ok) return null;
  try { return await r.json(); } catch (e) { return null; }
}

// { freeUntil: Map<work_id,int>, subWorks: Set<work_id> } — never throws.
async function loadEntitlement(DB, uid) {
  const freeUntil = new Map();
  const subWorks = new Set();
  try {
    const w = await DB.prepare('SELECT work_id, free_until_year FROM works').all();
    for (const row of (w.results || [])) freeUntil.set(row.work_id, row.free_until_year);
    if (uid) {
      const q = await DB.prepare(
        `SELECT pg.work_id FROM subscriptions s
           JOIN plan_grants pg ON pg.plan_id = s.plan_id
          WHERE s.clerk_user_id = ?1 AND s.status = 'active'
            AND (s.current_period_end IS NULL OR s.current_period_end > datetime('now'))`
      ).bind(uid).all();
      for (const row of (q.results || [])) subWorks.add(row.work_id);
    }
  } catch (e) { /* fail-safe: empty → only fallback free years visible */ }
  return { freeUntil, subWorks };
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
