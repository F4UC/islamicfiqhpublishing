/**
 * POST /api/auth/email/request — email a single-use magic link. Passwordless.
 *
 * Stores only the token HASH (never the raw token). Always returns { ok:true } for
 * any valid-format email (no account enumeration — a link is a sign-in OR sign-up).
 * Rate-limited per IP + per email. Never logs the token / link / email body.
 */
import { newSessionToken, sha256hex } from '../../../_lib/auth.js';
import { json, sameOriginOk, normalizeEmail, isValidEmail, sendMagicLink } from './_util.js';

const IP_WINDOW_MS = 60 * 1000;         // per-IP: ≤5 / minute
const IP_MAX = 5;
const EMAIL_WINDOW_MS = 15 * 60 * 1000; // per-email: ≤3 / 15 minutes
const EMAIL_MAX = 3;
const LINK_TTL_MS = 15 * 60 * 1000;     // magic link valid 15 minutes, single-use

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env || !env.DB) return json({ ok: false }, 503);
  if (!sameOriginOk(request)) return json({ ok: false }, 401);

  let body;
  try { body = await request.json(); } catch (e) { return json({ ok: false, error: 'bad_json' }, 400); }
  const email = normalizeEmail(body && body.email);
  if (!isValidEmail(email)) return json({ ok: false, error: 'bad_email' }, 400);

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  try {
    // Prune expired rate-limit rows, then enforce per-IP and per-email caps.
    await env.DB.prepare(
      "DELETE FROM auth_challenges WHERE kind='email-rl' AND datetime(expires_at) <= datetime('now')"
    ).run();
    const ipN = await env.DB.prepare(
      "SELECT COUNT(*) AS n FROM auth_challenges WHERE kind='email-rl' AND ref=? AND datetime(expires_at) > datetime('now')"
    ).bind('ip:' + ip).first();
    if (ipN && ipN.n >= IP_MAX) return json({ ok: false, error: 'rate_limited' }, 429);
    const emN = await env.DB.prepare(
      "SELECT COUNT(*) AS n FROM auth_challenges WHERE kind='email-rl' AND ref=? AND datetime(expires_at) > datetime('now')"
    ).bind('em:' + email).first();
    if (emN && emN.n >= EMAIL_MAX) return json({ ok: false, error: 'rate_limited' }, 429);
    await env.DB.prepare(
      "INSERT INTO auth_challenges (challenge, kind, ref, expires_at) VALUES (?, 'email-rl', ?, ?)"
    ).bind(newSessionToken(), 'ip:' + ip, new Date(Date.now() + IP_WINDOW_MS).toISOString()).run();
    await env.DB.prepare(
      "INSERT INTO auth_challenges (challenge, kind, ref, expires_at) VALUES (?, 'email-rl', ?, ?)"
    ).bind(newSessionToken(), 'em:' + email, new Date(Date.now() + EMAIL_WINDOW_MS).toISOString()).run();
  } catch (e) {
    // Rate-limit bookkeeping must never hard-block; fall through to issue the link.
  }

  try {
    // Single-use token: store ONLY its hash, keyed to the email.
    const token = newSessionToken();
    const hash = await sha256hex(token);
    await env.DB.prepare(
      "INSERT INTO auth_challenges (challenge, kind, ref, expires_at) VALUES (?, 'email-login', ?, ?)"
    ).bind(hash, email, new Date(Date.now() + LINK_TTL_MS).toISOString()).run();

    const origin = new URL(request.url).origin;
    const link = origin + '/api/auth/email/verify?token=' + encodeURIComponent(token);
    await sendMagicLink(env, email, link); // best-effort; response is identical regardless
  } catch (e) {
    // Never reveal failures to the caller (no enumeration / no config leak).
  }

  // Always identical — never reveal whether the email is registered.
  return json({ ok: true }, 200);
}
