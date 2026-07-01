/**
 * GET /api/auth/google/nonce — issue a single-use nonce that the client passes to
 * Google Identity Services and that POST /api/auth/google later requires inside the
 * id_token (replay protection). Phase 1a; parallel to live Clerk — grants nothing yet.
 *
 * Minimal per-IP rate limit (hardened before the Phase-2 cutover): tracked as
 * short-TTL rows in auth_challenges (kind='google-rl'), pruned opportunistically so
 * they stay bounded. Never logs anything sensitive.
 */
import { newSessionToken } from '../../../_lib/auth.js';

const RL_WINDOW_MS = 60 * 1000;   // 1-minute window
const RL_MAX = 30;                // max nonce issues per IP per window
const NONCE_TTL_MS = 5 * 60 * 1000;

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!env || !env.DB) return json({ ok: false, error: 'db_not_configured' }, 503);

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  try {
    // Prune expired rate-limit rows (keeps the table bounded), then count this IP's
    // recent issues and record this one.
    await env.DB.prepare(
      "DELETE FROM auth_challenges WHERE kind='google-rl' AND datetime(expires_at) <= datetime('now')"
    ).run();
    const c = await env.DB.prepare(
      "SELECT COUNT(*) AS n FROM auth_challenges WHERE kind='google-rl' AND ref=? AND datetime(expires_at) > datetime('now')"
    ).bind(ip).first();
    if (c && c.n >= RL_MAX) return json({ ok: false, error: 'rate_limited' }, 429);
    await env.DB.prepare(
      "INSERT INTO auth_challenges (challenge, kind, ref, expires_at) VALUES (?, 'google-rl', ?, ?)"
    ).bind(newSessionToken(), ip, new Date(Date.now() + RL_WINDOW_MS).toISOString()).run();
  } catch (e) {
    // Rate-limit bookkeeping must never hard-block issuance on a transient error.
  }

  const nonce = newSessionToken();
  try {
    await env.DB.prepare(
      "INSERT INTO auth_challenges (challenge, kind, expires_at) VALUES (?, 'google-nonce', ?)"
    ).bind(nonce, new Date(Date.now() + NONCE_TTL_MS).toISOString()).run();
  } catch (e) {
    return json({ ok: false, error: 'nonce_failed' }, 500);
  }
  return json({ nonce }, 200);
}
