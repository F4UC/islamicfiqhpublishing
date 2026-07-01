/**
 * POST /api/auth/signout — delete the current session row and clear the
 * __Host-ifp_sess cookie. Same-origin guard (mirrors the other auth POSTs).
 * Never logs the cookie/session token.
 */
import { destroySession } from '../../_lib/auth.js';

function sameOriginOk(request) {
  const selfOrigin = new URL(request.url).origin;
  const origin = request.headers.get('Origin');
  const secFetchSite = request.headers.get('Sec-Fetch-Site');
  if (origin && origin !== selfOrigin) return false;
  if (secFetchSite && secFetchSite !== 'same-origin' && secFetchSite !== 'none') return false;
  return true;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!sameOriginOk(request)) {
    return new Response(JSON.stringify({ ok: false }), {
      status: 401, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }
  const { setCookie } = await destroySession(env, request);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Set-Cookie': setCookie },
  });
}
