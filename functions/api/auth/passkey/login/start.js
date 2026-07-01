/**
 * POST /api/auth/passkey/login/start — begin a passkey login with discoverable
 * credentials (empty allowCredentials → no username typed). Stores a single-use,
 * server-side challenge. Never logs it.
 */
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { RP_ID, json, sameOriginOk } from '../_util.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env || !env.DB) return json({ ok: false }, 503);
  if (!sameOriginOk(request)) return json({ ok: false }, 401);

  try {
    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      allowCredentials: [],
      userVerification: 'preferred',
    });

    await env.DB.prepare(
      "INSERT INTO auth_challenges (challenge, kind, expires_at) VALUES (?, 'webauthn-login', ?)"
    ).bind(options.challenge, new Date(Date.now() + 5 * 60 * 1000).toISOString()).run();

    return json(options, 200);
  } catch (e) {
    return json({ ok: false }, 500);
  }
}
