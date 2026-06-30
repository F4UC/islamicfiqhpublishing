/**
 * POST /api/auth/passkey/register/finish — verify the attestation and store the
 * credential against the CURRENT account. Requires a live session. Single-use,
 * server-stored challenge bound to this user. Fails closed; never logs.
 */
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { readSession } from '../../../../_lib/auth.js';
import { RP_ID, RP_ORIGIN, json, bytesToB64url, clientDataChallenge, sameOriginOk } from '../_util.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env || !env.DB) return json({ ok: false }, 503);
  if (!sameOriginOk(request)) return json({ ok: false }, 401);

  const userId = await readSession(env, request);
  if (!userId) return json({ ok: false, error: 'auth_required' }, 401);

  let body;
  try { body = await request.json(); } catch (e) { return json({ ok: false }, 400); }

  try {
    // Bind to a challenge WE issued for THIS user (challenge from clientDataJSON +
    // kind + ref). Single-use: delete before verifying.
    const challenge = clientDataChallenge(body);
    if (!challenge) return json({ ok: false }, 400);
    const row = await env.DB.prepare(
      "SELECT challenge FROM auth_challenges WHERE challenge=? AND kind='webauthn-reg' AND ref=? AND datetime(expires_at) > datetime('now')"
    ).bind(challenge, userId).first();
    if (!row) return json({ ok: false }, 401);
    await env.DB.prepare('DELETE FROM auth_challenges WHERE challenge=?').bind(challenge).run();

    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: challenge,
      expectedOrigin: RP_ORIGIN,
      expectedRPID: RP_ID,
      requireUserVerification: false,
    });
    if (!verification.verified || !verification.registrationInfo) return json({ ok: false }, 401);

    const cred = verification.registrationInfo.credential; // { id, publicKey:Uint8Array, counter, transports }
    const credId = cred.id; // already base64url
    const publicKey = bytesToB64url(cred.publicKey);
    const counter = cred.counter || 0;
    const transports = JSON.stringify(cred.transports || []);

    // Idempotent on cred_id (PK): a re-submit of the same credential is a no-op.
    await env.DB.prepare(
      `INSERT INTO passkey_credentials (cred_id, user_id, public_key, counter, transports)
       VALUES (?,?,?,?,?)
       ON CONFLICT(cred_id) DO NOTHING`
    ).bind(credId, userId, publicKey, counter, transports).run();

    return json({ ok: true }, 200);
  } catch (e) {
    return json({ ok: false }, 401);
  }
}
