/**
 * Phase-0 self-test (POST /api/auth/_selftest) — proves the functions/_lib import
 * pattern resolves at runtime on Pages, and that mint→read round-trips against D1.
 *
 * Returns NO secrets/tokens in the body (or logs). Creates a throwaway session row
 * and deletes it. Removed in a later phase.
 */
import { genUserId, mintSession, readSession } from '../../_lib/auth.js';

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env || !env.DB) return json({ ok: false, error: 'db_not_configured' }, 503);

  const importedLib =
    typeof genUserId === 'function' &&
    typeof mintSession === 'function' &&
    typeof readSession === 'function';

  let uid = null;
  try {
    uid = genUserId();
    const { token } = await mintSession(env, uid, { days: 1 });
    // Round-trip: read the session back through a synthetic request carrying the cookie.
    const probe = new Request(request.url, {
      headers: { Cookie: '__Host-ifp_sess=' + token },
    });
    const back = await readSession(env, probe);
    const roundTrip = back === uid;
    return json({ ok: true, importedLib, roundTrip }, 200);
  } catch (e) {
    return json({ ok: false, importedLib, roundTrip: false, error: 'selftest_failed' }, 500);
  } finally {
    // Best-effort cleanup so the self-test never accrues rows.
    if (uid) { try { await env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(uid).run(); } catch (_) {} }
  }
}
