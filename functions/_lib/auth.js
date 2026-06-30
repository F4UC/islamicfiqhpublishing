/**
 * First-party auth foundation — shared helper (Phase 0).
 *
 * `functions/_lib/` is NOT routed by Pages (leading underscore), but is importable
 * by Functions. Web Crypto only — no new secrets. Session tokens are opaque random
 * 256-bit values; only their SHA-256 hash is ever stored, never the raw token.
 *
 * Runs parallel to live Clerk. NOTHING here is wired into any gate this phase.
 *
 * ⚠️ Never log tokens, id_tokens, session tokens, challenges, or cookie values.
 */

const COOKIE_NAME = '__Host-ifp_sess';

/* base64url (no padding) of a byte array. */
function b64url(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function randomBytes(n) {
  const a = new Uint8Array(n);
  crypto.getRandomValues(a);
  return a;
}

/* 'usr_' + base64url(16 random bytes). */
export function genUserId() {
  return 'usr_' + b64url(randomBytes(16));
}

/* base64url(32 random bytes) — 256-bit opaque session token. */
export function newSessionToken() {
  return b64url(randomBytes(32));
}

/* Hex SHA-256 of a string (Web Crypto). */
export async function sha256hex(str) {
  const data = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(buf);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) hex += bytes[i].toString(16).padStart(2, '0');
  return hex;
}

/* Read the raw session cookie value from a request, or null. */
function cookieToken(request) {
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(/(?:^|;\s*)__Host-ifp_sess=([^;]+)/);
  return (m && m[1]) ? m[1] : null;
}

/* Build a __Host- session cookie string. maxAge in seconds (0 = expire now). */
function cookieString(token, maxAge) {
  return COOKIE_NAME + '=' + token +
    '; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=' + maxAge;
}

/**
 * Insert a new session and return { token, setCookie }. Only the hash is stored.
 * The caller attaches setCookie as a Set-Cookie header on its response.
 */
export async function mintSession(env, userId, opts) {
  const days = (opts && opts.days) || 30;
  const token = newSessionToken();
  const hash = await sha256hex(token);
  const expiresAt = new Date(Date.now() + days * 86400 * 1000).toISOString();
  await env.DB.prepare(
    'INSERT INTO sessions (session_hash, user_id, expires_at) VALUES (?,?,?)'
  ).bind(hash, userId, expiresAt).run();
  return { token, setCookie: cookieString(token, days * 86400) };
}

/**
 * Resolve the signed-in user id from the session cookie, or null.
 * NEVER throws (missing/invalid cookie or DB error → null).
 */
export async function readSession(env, request) {
  try {
    const token = cookieToken(request);
    if (!token) return null;
    const hash = await sha256hex(token);
    const row = await env.DB.prepare(
      'SELECT user_id FROM sessions WHERE session_hash=? AND datetime(expires_at) > datetime(\'now\')'
    ).bind(hash).first();
    return (row && row.user_id) ? row.user_id : null;
  } catch (e) {
    return null;
  }
}

/**
 * Delete the current session row (if any) and return an immediately-expiring
 * Set-Cookie. NEVER throws.
 */
export async function destroySession(env, request) {
  try {
    const token = cookieToken(request);
    if (token) {
      const hash = await sha256hex(token);
      await env.DB.prepare('DELETE FROM sessions WHERE session_hash=?').bind(hash).run();
    }
  } catch (e) { /* best-effort */ }
  return { setCookie: cookieString('', 0) };
}

/**
 * FUTURE gate function (NOT wired into any gate this phase).
 * Wraps readSession → { userId } | null.
 */
export async function verifyUserBySession(env, request) {
  const userId = await readSession(env, request);
  return userId ? { userId } : null;
}

/**
 * Account-linking rule (baked in now so Apple slots in later with no teardown):
 *   1. existing oauth_accounts(provider, sub) → return its user_id
 *   2. else if email is present AND verified, and a users row has that email →
 *      link (insert oauth_accounts pointing at that user_id), return it.
 *      Linking ONLY on a verified email prevents both duplicate accounts AND
 *      email-spoof account hijacks.
 *   3. else → new user_id, insert users + oauth_accounts, return it.
 */
export async function linkOrCreateUser(env, opts) {
  const provider = opts.provider;
  const sub = opts.sub;
  const email = opts.email || null;
  const emailVerified = !!opts.emailVerified;
  const displayName = opts.displayName || null;

  // 1. already linked
  const linked = await env.DB.prepare(
    'SELECT user_id FROM oauth_accounts WHERE provider=? AND provider_sub=?'
  ).bind(provider, sub).first();
  if (linked && linked.user_id) return linked.user_id;

  // 2. link to an existing user by verified email — BOTH sides must be verified.
  // The incoming login is verified (emailVerified) AND the existing row must carry
  // email_verified=1. Without the stored-side check, an attacker who first logged in
  // with a provider supplying an UNVERIFIED victim address would have created a
  // users row (email_verified=0); the real owner's later verified login would then
  // link onto the attacker's account. Requiring email_verified=1 closes that hijack.
  if (email && emailVerified) {
    const u = await env.DB.prepare(
      'SELECT user_id FROM users WHERE email=? AND email_verified=1 LIMIT 1'
    ).bind(email).first();
    if (u && u.user_id) {
      await env.DB.prepare(
        'INSERT INTO oauth_accounts (provider, provider_sub, user_id, email) VALUES (?,?,?,?)'
      ).bind(provider, sub, u.user_id, email).run();
      return u.user_id;
    }
  }

  // 3. brand-new user
  const userId = genUserId();
  await env.DB.prepare(
    'INSERT INTO users (user_id, email, email_verified, display_name) VALUES (?,?,?,?)'
  ).bind(userId, email, emailVerified ? 1 : 0, displayName).run();
  await env.DB.prepare(
    'INSERT INTO oauth_accounts (provider, provider_sub, user_id, email) VALUES (?,?,?,?)'
  ).bind(provider, sub, userId, email).run();
  return userId;
}
