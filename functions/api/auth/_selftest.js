/**
 * Phase-0 self-test (POST /api/auth/_selftest) — proves the functions/_lib import
 * pattern resolves at runtime on Pages and that the Web-Crypto helpers run.
 *
 * IMPORT-ONLY: performs NO database writes, so it has zero unauthenticated-write
 * surface (Rule 84: pages.dev previews are public). Also preview-only — 404 on the
 * production custom domain. Returns no secrets/tokens. Removed in a later phase.
 */
import { genUserId, newSessionToken, sha256hex, mintSession, readSession } from '../../_lib/auth.js';

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export async function onRequestPost(context) {
  const { request } = context;

  // Preview-only: never expose this test route on the production custom domain.
  let host = '';
  try { host = new URL(request.url).hostname; } catch (_) {}
  if (!host.endsWith('.pages.dev')) return json({ ok: false, error: 'not_available' }, 404);

  // The thing this route exists to prove: the _lib module imports/resolves on Pages.
  const importedLib =
    typeof genUserId === 'function' &&
    typeof newSessionToken === 'function' &&
    typeof sha256hex === 'function' &&
    typeof mintSession === 'function' &&
    typeof readSession === 'function';

  // Exercise the pure Web-Crypto helpers (NO DB): shape-check only, no secrets returned.
  let libWorks = false;
  try {
    const id = genUserId();
    const hash = await sha256hex('ifp-selftest');
    libWorks = id.indexOf('usr_') === 0 && /^[0-9a-f]{64}$/.test(hash);
  } catch (_) { libWorks = false; }

  const ok = importedLib && libWorks;
  return json({ ok, importedLib, libWorks }, ok ? 200 : 500);
}
