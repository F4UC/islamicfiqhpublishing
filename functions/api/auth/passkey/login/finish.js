/**
 * POST /api/auth/passkey/login/finish — verify a discoverable-credential assertion
 * and mint a first-party session. Challenge is single-use + server-issued; the
 * library enforces origin/RPID and counter-regression (clone detection). Parallel
 * to live Clerk (session not read by any gate yet). Fails closed; never logs.
 */
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { mintSession } from '../../../../_lib/auth.js';
import { RP_ID, RP_ORIGIN, json, b64urlToBytes, clientDataChallenge, sameOriginOk } from '../_util.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env || !env.DB) return json({ ok: false }, 503);
  if (!sameOriginOk(request)) return json({ ok: false }, 401);

  let body;
  try { body = await request.json(); } catch (e) { return json({ ok: false }, 400); }

  try {
    // Resolve the stored credential by the assertion's credential id.
    const credId = body && body.id;
    if (!credId) return json({ ok: false }, 401);
    const credRow = await env.DB.prepare(
      'SELECT user_id, public_key, counter FROM passkey_credentials WHERE cred_id=?'
    ).bind(credId).first();
    if (!credRow || !credRow.user_id) return json({ ok: false }, 401);

    // Bind to a challenge WE issued (single-use): take it from clientDataJSON, then
    // require a matching unexpired webauthn-login row, and consume it.
    const challenge = clientDataChallenge(body);
    if (!challenge) return json({ ok: false }, 401);
    const chRow = await env.DB.prepare(
      "SELECT challenge FROM auth_challenges WHERE challenge=? AND kind='webauthn-login' AND datetime(expires_at) > datetime('now')"
    ).bind(challenge).first();
    if (!chRow) return json({ ok: false }, 401);
    await env.DB.prepare('DELETE FROM auth_challenges WHERE challenge=?').bind(challenge).run();

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge: challenge,
      expectedOrigin: RP_ORIGIN,
      expectedRPID: RP_ID,
      credential: {
        id: credId,
        publicKey: b64urlToBytes(credRow.public_key),
        counter: credRow.counter || 0,
      },
      requireUserVerification: false,
    });
    if (!verification.verified) return json({ ok: false }, 401);

    // Clone detection: persist the advanced sign-count (the library already rejects
    // a regression above).
    const newCounter = verification.authenticationInfo.newCounter;
    await env.DB.prepare('UPDATE passkey_credentials SET counter=? WHERE cred_id=?')
      .bind(newCounter, credId).run();

    const { setCookie } = await mintSession(env, credRow.user_id);
    return json({ ok: true }, 200, { 'Set-Cookie': setCookie });
  } catch (e) {
    return json({ ok: false }, 401);
  }
}
