/**
 * Pages Functions middleware — 404 internal/dev paths so they are never served publicly.
 * Functions run BEFORE static-asset serving on Cloudflare Pages, so this reliably blocks
 * real files (which `_redirects` cannot — static assets win over `_redirects`). Everything
 * not blocked falls through to normal static / Function handling via context.next().
 */
const BLOCKED = [
  /^\/(CLAUDE|AGENTS|CONTEXT|DEBUG-FINDINGS|REVIEW-QUEUE|AUDIT-FIXES|README)\.md$/,
  /^\/docs(\/|$)/,
  /^\/scripts\//,
  /^\/articles\/_TEMPLATE(\.html)?$/,
  /^\/\.claude\//,
  /^\/\.codex\//,
  /^\/\.github\//,
];

export async function onRequest(context) {
  const path = new URL(context.request.url).pathname;
  if (BLOCKED.some((re) => re.test(path))) {
    return new Response("Not Found", { status: 404 });
  }
  return context.next();
}
