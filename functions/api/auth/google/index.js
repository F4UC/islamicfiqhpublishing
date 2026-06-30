/**
 * POST /api/auth/google — verify a Google id_token with jose, bind it to our
 * single-use server nonce, link/create the first-party user, and mint a session.
 *
 * Phase 1a: parallel to live Clerk. The minted session is NOT read by any gate yet
 * (Clerk still gates) — so this grants nothing; that's expected this phase.
 *
 * Fails closed (401) on any miss. Never logs the id_token, nonce, session token,
 * or cookie; never echoes the failure reason.
 */
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { linkOrCreateUser, mintSession } from '../../../_lib/auth.js';

// Google's JWKS — jose caches keys across invocations.
const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

function json(body, status, extraHeaders) {
  const headers = Object.assign(
    { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    extraHeaders || {}
  );
  return new Response(JSON.stringify(body), { status, headers });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env || !env.DB || !env.GOOGLE_CLIENT_ID) return json({ ok: false }, 401);

  let body;
  try { body = await request.json(); } catch (e) { return json({ ok: false }, 401); }
  const credential = body && body.credential;
  const nonce = body && body.nonce;
  if (!credential || !nonce) return json({ ok: false }, 401);

  try {
    // 1. Single-use nonce: must exist + be unexpired. Consume it (DELETE) before
    //    verifying so it can't be replayed even on a later failure.
    const row = await env.DB.prepare(
      "SELECT challenge FROM auth_challenges WHERE challenge=? AND kind='google-nonce' AND datetime(expires_at) > datetime('now')"
    ).bind(nonce).first();
    if (!row) return json({ ok: false }, 401);
    await env.DB.prepare('DELETE FROM auth_challenges WHERE challenge=?').bind(nonce).run();

    // 2. Verify the id_token. jose enforces signature + iss + aud + exp.
    const { payload } = await jwtVerify(credential, JWKS, {
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
      audience: env.GOOGLE_CLIENT_ID,
    });
    // Bind the token to our server-issued nonce (blocks replay of a token minted
    // for a different request).
    if (payload.nonce !== nonce) return json({ ok: false }, 401);

    // 3. Extract identity.
    const sub = payload.sub;
    if (!sub) return json({ ok: false }, 401);
    const email = payload.email || null;
    const emailVerified = payload.email_verified === true;
    const displayName = payload.name || null;

    // 4. Link or create the first-party user (shared helper — no logic duplicated).
    const userId = await linkOrCreateUser(env, {
      provider: 'google', sub, email, emailVerified, displayName,
    });

    // 5. Mint an opaque session (only its hash is stored) → __Host- cookie.
    const { setCookie } = await mintSession(env, userId);

    // 6. Success. Set the session cookie; echo no identifiers.
    return json({ ok: true }, 200, { 'Set-Cookie': setCookie });
  } catch (e) {
    return json({ ok: false }, 401); // fail closed; no reason detail, no logging
  }
}
