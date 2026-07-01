/**
 * Shared helpers for the passkey (WebAuthn) routes. `_util.js` (leading underscore)
 * is NOT routed by Pages but is importable by the route files. Never logs anything.
 */

export const RP_ID = 'islamicfiqhpublishing.com';
export const RP_NAME = 'Islamic Fiqh Publishing';
export const RP_ORIGIN = 'https://islamicfiqhpublishing.com';

export function json(body, status, extraHeaders) {
  const headers = Object.assign(
    { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    extraHeaders || {}
  );
  return new Response(JSON.stringify(body), { status, headers });
}

/* base64url (no padding) of a byte array. */
export function bytesToB64url(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/* base64url string → Uint8Array. */
export function b64urlToBytes(str) {
  let s = String(str).replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/* Extract the (base64url) challenge the browser echoed in clientDataJSON. Used to
   bind an assertion/attestation to a challenge WE issued. Returns null on any miss. */
export function clientDataChallenge(response) {
  try {
    const cdj = response && response.response && response.response.clientDataJSON;
    if (!cdj) return null;
    const data = JSON.parse(new TextDecoder().decode(b64urlToBytes(cdj)));
    return data && data.challenge ? data.challenge : null;
  } catch (e) {
    return null;
  }
}

/* Same-origin guard (mirrors the Google login CSRF fix): reject cross-site POSTs
   before any state change. WebAuthn is already origin-bound via expectedOrigin, but
   this keeps parity across the auth endpoints. */
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
