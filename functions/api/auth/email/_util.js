/**
 * Shared helpers for the email magic-link routes. `_util.js` (leading underscore)
 * is not routed by Pages but importable by the route files. Never logs anything.
 */

export function json(body, status, extraHeaders) {
  const headers = Object.assign(
    { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    extraHeaders || {}
  );
  return new Response(JSON.stringify(body), { status, headers });
}

/* Same-origin guard for the request (send) endpoint — mirrors the other auth POSTs.
   (NOT used on verify: that's a top-level navigation from the user's email client.) */
export function sameOriginOk(request) {
  const selfOrigin = new URL(request.url).origin;
  const origin = request.headers.get('Origin');
  const secFetchSite = request.headers.get('Sec-Fetch-Site');
  const contentType = (request.headers.get('Content-Type') || '').toLowerCase();
  if (origin && origin !== selfOrigin) return false;
  if (secFetchSite && secFetchSite !== 'same-origin' && secFetchSite !== 'none') return false;
  if (contentType.indexOf('application/json') === -1) return false;
  return true;
}

/* Canonical email key: trim + lowercase (matches linkOrCreateUser's normalization). */
export function normalizeEmail(raw) {
  return (raw ? String(raw).trim().toLowerCase() : '');
}

/* Pragmatic format check — one @, a dot in the domain, no spaces, sane length. */
export function isValidEmail(e) {
  return typeof e === 'string' && e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

/* Send the magic link via Resend (HTTP API — Workers-safe). Returns false if the
   sender isn't configured or the send fails. NEVER logs the link or email body. */
export async function sendMagicLink(env, toEmail, link) {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM) return false;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: [toEmail],
        subject: 'ลิงก์เข้าสู่ระบบ · Islamic Fiqh Publishing',
        text:
          'คลิกลิงก์นี้เพื่อเข้าสู่ระบบ Islamic Fiqh Publishing:\n\n' + link +
          '\n\nลิงก์นี้ใช้ได้ครั้งเดียวและหมดอายุใน 15 นาที หากคุณไม่ได้ร้องขอ โปรดเพิกเฉยต่ออีเมลนี้',
        html:
          '<p>คลิกปุ่มด้านล่างเพื่อเข้าสู่ระบบ Islamic Fiqh Publishing:</p>' +
          '<p><a href="' + link + '" style="display:inline-block;background:#c49a45;color:#fff;' +
          'text-decoration:none;padding:11px 22px;border-radius:8px;font-family:sans-serif">เข้าสู่ระบบ</a></p>' +
          '<p style="color:#6b6258;font-size:13px">ลิงก์นี้ใช้ได้ครั้งเดียวและหมดอายุใน 15 นาที ' +
          'หากคุณไม่ได้ร้องขอ โปรดเพิกเฉยต่ออีเมลนี้</p>',
      }),
    });
    return r.ok;
  } catch (e) {
    return false;
  }
}
