/**
 * Gated Time Machine API — STEP 1: IDENTITY ONLY (verify Clerk JWT → userId).
 *
 * This is login-only scaffolding. It proves the token path end-to-end:
 *   - valid Bearer <Clerk session JWT>  -> 200 { ok: true, userId }
 *   - missing / invalid token           -> 401 { ok: false, error }
 *   - secret not configured yet         -> 503 { ok: false, error }
 *
 * Content gating (D1 entitlement → owned shards / locked-stub / server-side
 * search filter) and any Stripe logic are LATER steps — not here. The real
 * authorization decision happens server-side; the client only fetches a token.
 *
 * CLERK_SECRET_KEY is a Cloudflare Pages secret (set via
 * `wrangler pages secret put CLERK_SECRET_KEY`) — NEVER committed.
 * @clerk/backend runs on the Cloudflare Workers runtime.
 *
 * Route: functions/api/tm/[[path]].js catches every /api/tm/* path
 * (e.g. /api/tm/whoami, /api/tm/year/5) for STEP 1's session self-check.
 */
import { createClerkClient } from '@clerk/backend';

export async function onRequest({ request, env }) {
  if (!env || !env.CLERK_SECRET_KEY) {
    return json({ ok: false, error: 'auth_not_configured' }, 503);
  }

  const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

  // Allowed origins for token verification. Env-driven (comma-separated) so
  // preview deploys / custom domains can verify without a code change; falls
  // back to the production origin only.
  const authorizedParties = (env.CLERK_AUTHORIZED_PARTIES
    ? env.CLERK_AUTHORIZED_PARTIES.split(',').map((s) => s.trim()).filter(Boolean)
    : ['https://islamicfiqhpublishing.com']);

  let state;
  try {
    state = await clerk.authenticateRequest(request, { authorizedParties });
  } catch (e) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }

  // `isAuthenticated` is the current property; `isSignedIn` is the older alias.
  const signedIn = state && (state.isAuthenticated ?? state.isSignedIn);
  if (!signedIn) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }

  const auth = state.toAuth();
  const userId = auth && auth.userId;
  // TODO (next step): upsert users(clerk_user_id, email) into D1, then check
  // entitlement and return owned shards / locked-stubs. Not in this PR.
  return json({ ok: true, userId }, 200);
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
