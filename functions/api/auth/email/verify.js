/**
 * GET /api/auth/email/verify?token=… — consume a single-use magic link and sign in.
 *
 * Clicking a link delivered to the inbox proves control of it → the email is verified.
 * Hash the token, require a matching unexpired 'email-login' row, DELETE it (single-use)
 * BEFORE minting, then linkOrCreateUser(provider:'email') + mintSession → 302 to '/'.
 * Never renders or logs the token. No same-origin guard: this is a top-level navigation
 * from the user's email client (Origin is cross-site / none by design).
 */
import { sha256hex, linkOrCreateUser, mintSession } from '../../../_lib/auth.js';

function redirect(location, setCookie) {
  const headers = { Location: location, 'Cache-Control': 'no-store' };
  if (setCookie) headers['Set-Cookie'] = setCookie;
  return new Response(null, { status: 302, headers });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!env || !env.DB) return redirect('/login?e=expired');

  const token = new URL(request.url).searchParams.get('token');
  if (!token) return redirect('/login?e=expired');

  try {
    const hash = await sha256hex(token);
    const row = await env.DB.prepare(
      "SELECT ref FROM auth_challenges WHERE challenge=? AND kind='email-login' AND datetime(expires_at) > datetime('now')"
    ).bind(hash).first();
    if (!row || !row.ref) return redirect('/login?e=expired');

    // Single-use: consume before minting so a leaked/reused link can't sign in twice.
    await env.DB.prepare('DELETE FROM auth_challenges WHERE challenge=?').bind(hash).run();

    const email = row.ref; // already lowercased at request time
    const userId = await linkOrCreateUser(env, {
      provider: 'email', sub: email, email, emailVerified: true, displayName: null,
    });
    const { setCookie } = await mintSession(env, userId);
    return redirect('/', setCookie);
  } catch (e) {
    return redirect('/login?e=expired');
  }
}
