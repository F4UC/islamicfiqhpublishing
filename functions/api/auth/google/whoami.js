/**
 * GET /api/auth/google/whoami — tiny echo for the test harness. Reads the session
 * cookie via the shared helper and returns { userId } (opaque id, not a secret) or
 * { userId: null }. Never returns the cookie or session token. Phase 1a only.
 */
import { readSession } from '../../../_lib/auth.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  const userId = await readSession(env, request);
  return new Response(JSON.stringify({ userId: userId || null }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
