/**
 * GET /api/auth/google/config — echoes the PUBLIC Google client id so /login needn't
 * hardcode it. Non-secret: the client id is shipped to every browser by Google
 * Identity Services.
 */
export async function onRequestGet(context) {
  const { env } = context;
  return new Response(JSON.stringify({ clientId: (env && env.GOOGLE_CLIENT_ID) || null }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
