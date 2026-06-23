/**
 * Pages Functions middleware — return 404 for internal / dev paths so they are never
 * served on the public site.
 *
 * Why a Function (not _redirects): on Cloudflare Pages, static assets win over
 * `_redirects`, so a `_redirects` 404 is a no-op for a path that has a real file.
 * Functions run BEFORE static-asset serving, so this reliably overrides real files.
 *
 * Everything not explicitly blocked falls through to normal handling (static assets
 * and other Functions such as /api/*) via context.next(). Cheap: exact-Set + prefix
 * startsWith, no regex, early return.
 */
const BLOCK_EXACT = new Set([
  "/CLAUDE.md",
  "/AGENTS.md",
  "/CONTEXT.md",
  "/DEBUG-FINDINGS.md",
  "/REVIEW-QUEUE.md",
  "/AUDIT-FIXES.md",
  "/README.md",
  "/articles/_TEMPLATE",
  "/articles/_TEMPLATE.html",
]);

const BLOCK_PREFIX = ["/docs/", "/scripts/", "/.claude/", "/.codex/", "/.github/"];

export async function onRequest(context) {
  const path = new URL(context.request.url).pathname;
  if (BLOCK_EXACT.has(path) || BLOCK_PREFIX.some((p) => path.startsWith(p))) {
    return new Response("Not Found", { status: 404 });
  }
  return context.next();
}
