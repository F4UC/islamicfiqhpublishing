/**
 * Pages Functions middleware — return 404 for internal / dev paths so they are never
 * served on the public site.
 *
 * Why a Function (not _redirects): on Cloudflare Pages, static assets win over
 * `_redirects`, so a `_redirects` 404 is a no-op for a path that has a real file.
 * Functions run BEFORE static-asset serving, so this reliably overrides real files.
 *
 * Blocking strategy (three passes, short-circuit):
 *   1. BLOCK_EXACT  — extensionless internal files + _TEMPLATE variants
 *   2. BLOCK_PREFIX — entire internal dirs (docs/, scripts/, .claude/, .codex/, .github/)
 *                     and the raw ijazah graph files (served only via the gated
 *                     /api/ijazah worker, which reaches them through env.ASSETS)
 *   3. BLOCK_EXT    — all .md, .py, .sha256, .gitignore files anywhere in the tree
 *
 * Everything else falls through via context.next() (static assets, /api/*, etc.).
 * Cheap: Set.has (O(1)) + small Array.some with startsWith/endsWith, early return.
 */
const BLOCK_EXACT = new Set([
  "/articles/_TEMPLATE",
  "/articles/_TEMPLATE.html",
  "/pages/tools/ijazah-data/NOTICE",
]);

const BLOCK_PREFIX = ["/docs/", "/scripts/", "/.claude/", "/.codex/", "/.github/", "/pages/tools/ijazah-data/graphs/", "/pages/tools/timemachine-data/bidayah-h"];

const BLOCK_EXT = [".md", ".py", ".sha256", ".gitignore"];

export async function onRequest(context) {
  const path = new URL(context.request.url).pathname;
  if (
    BLOCK_EXACT.has(path) ||
    BLOCK_PREFIX.some((p) => path.startsWith(p)) ||
    BLOCK_EXT.some((e) => path.endsWith(e))
  ) {
    return new Response("Not Found", { status: 404 });
  }
  return context.next();
}
