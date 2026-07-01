/**
 * POST /api/auth/passkey/register/start — begin adding a passkey to the CURRENT
 * account. Requires a live session (sign in with Google first). Parallel to live
 * Clerk; mints nothing. Never logs the challenge.
 */
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { readSession } from '../../../../_lib/auth.js';
import { RP_ID, RP_NAME, json, b64urlToBytes, sameOriginOk } from '../_util.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env || !env.DB) return json({ ok: false }, 503);
  if (!sameOriginOk(request)) return json({ ok: false }, 401);

  const userId = await readSession(env, request);
  if (!userId) return json({ ok: false, error: 'auth_required' }, 401);

  try {
    let userRow = null;
    try { userRow = await env.DB.prepare('SELECT email FROM users WHERE user_id=?').bind(userId).first(); } catch (e) {}
    const userName = (userRow && userRow.email) ? userRow.email : userId;

    const { results } = await env.DB.prepare(
      'SELECT cred_id, transports FROM passkey_credentials WHERE user_id=?'
    ).bind(userId).all();
    const excludeCredentials = (results || []).map((r) => {
      let t = [];
      try { t = r.transports ? JSON.parse(r.transports) : []; } catch (e) { t = []; }
      return { id: r.cred_id, transports: t };
    });

    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userID: new TextEncoder().encode(userId),
      userName,
      attestationType: 'none',
      excludeCredentials,
      authenticatorSelection: { residentKey: 'required', userVerification: 'preferred' },
    });

    await env.DB.prepare(
      "INSERT INTO auth_challenges (challenge, kind, ref, expires_at) VALUES (?, 'webauthn-reg', ?, ?)"
    ).bind(options.challenge, userId, new Date(Date.now() + 5 * 60 * 1000).toISOString()).run();

    return json(options, 200);
  } catch (e) {
    return json({ ok: false }, 500);
  }
}
