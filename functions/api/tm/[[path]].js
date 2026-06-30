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
 * Entitlement model (al-bidayah = the Time Machine timeline product) — 3-tier:
 *   - Guest (no token)  => every year locked; popup "register".
 *   - FIQH free (login) => years 1..works.free_until_year (=5) unlocked; popup "FIQH+/PRO".
 *   - FIQH+ (plan_grants.year_cap=11) => years 1..11; popup "upgrade PRO".
 *   - FIQH PRO (plan_grants.year_cap=NULL) => all years unlocked; no popup.
 *   - Locked year => each event keeps `title` + each account's byte-exact
 *     `arabicExcerpt` teaser; the Thai `detail` (the paid moat) is STRIPPED.
 *   - `meta.tier` ('guest'|'free'|'plus'|'pro') drives the front-end popup.
 *
 * Secrets/bindings (per Cloudflare Pages environment, never committed):
 *   CLERK_SECRET_KEY (secret) + CLERK_PUBLISHABLE_KEY (non-secret) + D1 binding `DB`.
 *   @clerk/backend runs on the Workers runtime.
 */
import { createClerkClient } from '@clerk/backend';

const DATA_BASE = '/pages/tools/timemachine-data/';
const BIDAYAH_WORK = 'al-bidayah';     // the Time Machine timeline's product id

export async function onRequest(context) {
  const { request, env, params } = context;
  const segs = Array.isArray(params.path) ? params.path : (params.path ? [params.path] : []);
  const route = segs.join('/');

  if (route === 'whoami') return handleWhoami(request, env);
  if (route === 'me') return handleMe(request, env);
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

// Current membership snapshot for the account page. Never 401 (guest => tier 'guest').
async function handleMe(request, env) {
  if (!env || !env.DB) return json({ ok:false, error:'db_not_configured' }, 503);
  const uid = await verifyUser(request, env);
  if (!uid) return json({ ok:true, authed:false, tier:'guest' }, 200);
  let sub = null;
  try {
    sub = await env.DB.prepare(
      `SELECT s.plan_id AS planId, s.current_period_end AS periodEnd,
              p.title_th AS planTitle, p.price_thb AS price
         FROM subscriptions s JOIN plans p ON p.plan_id = s.plan_id
        WHERE s.clerk_user_id = ? AND s.status = 'active'
          AND datetime(s.current_period_end) > datetime('now')
        ORDER BY p.price_thb DESC LIMIT 1`
    ).bind(uid).first();
  } catch (e) { sub = null; }
  if (!sub) return json({ ok:true, authed:true, tier:'free', planTitle:'FIQH (ฟรี)' }, 200);
  const tier = sub.planId === 'fiqh-pro' ? 'pro' : (sub.planId === 'fiqh-plus' ? 'plus' : 'paid');
  return json({ ok:true, authed:true, tier, planId:sub.planId, planTitle:sub.planTitle, periodEnd:sub.periodEnd }, 200);
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
  const ent = await loadEntitlement(env.DB, uid);      // { freeUntil:int, grants:{} }

  const shard = await readShard(request, year, env);
  if (!shard) return json({ ok: false, error: 'year_not_found' }, 404);

  const unlocked = yearUnlocked(uid, ent, year);

  let events = Array.isArray(shard.events) ? shard.events : [];
  if (!unlocked) events = events.map(stubEvent);

  const tier = !uid ? 'guest' :
    (('al-bidayah' in ent.grants) && ent.grants['al-bidayah'] === null) ? 'pro' :
    ('al-bidayah' in ent.grants) ? 'plus' : 'free';
  const meta = Object.assign({}, shard.meta, {
    yearLocked: !unlocked, authed: !!uid,
    freeUntilYear: ent.freeUntil, tier,
  });
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

// Read the static shard. Prefer ASSETS (bypasses the _middleware block on raw shards);
// fall back to same-origin fetch only if ASSETS is unavailable.
async function readShard(request, year, env) {
  const url = new URL(DATA_BASE + 'bidayah-h' + year + '.json', request.url);
  const r = (env && env.ASSETS)
    ? await env.ASSETS.fetch(new Request(url.toString()))
    : await fetch(url.toString(), { cf: { cacheTtl: 300 } });
  if (!r.ok) return null;
  try { return await r.json(); } catch (e) { return null; }
}

// { freeUntil: int, grants: { work_id: int|null } } — never throws.
// freeUntil = works.free_until_year for 'al-bidayah' (= 5 per D1); 0 if row missing.
// grants: keyed by work_id; value is year_cap (null = unlimited / PRO).
//   Multiple active plan_grants for the same work are merged: null wins, else max cap.
// Keeps datetime() normalization to guard against ISO-string expiry leak (see history).
async function loadEntitlement(DB, uid) {
  try {
    const w = await DB.prepare(
      `SELECT free_until_year AS f FROM works WHERE work_id = 'al-bidayah'`
    ).first();
    const freeUntil = w ? (w.f || 0) : 0;
    if (!uid) return { freeUntil, grants: {} };
    const { results } = await DB.prepare(
      `SELECT pg.work_id AS work, pg.year_cap AS cap
         FROM subscriptions s JOIN plan_grants pg ON pg.plan_id = s.plan_id
        WHERE s.clerk_user_id = ? AND s.status = 'active'
          AND datetime(s.current_period_end) > datetime('now')`
    ).bind(uid).all();
    const grants = {};
    for (const r of (results || [])) {
      const cap = (r.cap == null) ? null : r.cap;
      if (!(r.work in grants)) grants[r.work] = cap;
      else if (grants[r.work] !== null) {
        grants[r.work] = (cap === null) ? null : Math.max(grants[r.work], cap);
      }
    }
    return { freeUntil, grants };
  } catch (e) { return { freeUntil: 0, grants: {} }; /* fail-safe: everything locked */ }
}

// Guest: always locked. FIQH free: years 1..freeUntil. FIQH+: up to cap. PRO: cap null = all.
function yearUnlocked(uid, ent, year) {
  if (!uid) return false;
  if (year <= ent.freeUntil) return true;
  const cap = (BIDAYAH_WORK in ent.grants) ? ent.grants[BIDAYAH_WORK] : undefined;
  if (cap === undefined) return false;
  return cap === null || year <= cap;
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
