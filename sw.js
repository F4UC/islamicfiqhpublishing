/* =============================================================================
 * Islamic Fiqh Publishing — Service Worker
 *
 * ★ MIRRORS _headers, NEVER FIGHTS IT ★
 * _headers serves ALL HTML (`/`, `*.html`, `/articles/*`, `/pages/*`) as
 * `no-cache, no-store, must-revalidate` so Cloudflare Custom Purge + edits reach
 * users immediately. Therefore HTML/navigations are NETWORK-FIRST here: online
 * users always get fresh HTML; the cached copy is an OFFLINE fallback only.
 *
 * Strategy:
 *   - HTML / navigation requests      → NETWORK-FIRST (cache only as offline fallback)
 *   - *.js *.css *.woff2 *.woff images → CACHE-FIRST (assets are immutable, 1yr)
 *   - *.json (articles/works/data/…)  → STALE-WHILE-REVALIDATE
 *   - cross-origin (quran/sunnah/cf)  → NETWORK-ONLY, never intercepted/cached
 *
 * CACHE_VERSION — bump on every deploy to invalidate the precache + runtime
 * caches (this is how a Purge + redeploy reaches already-installed users).
 * ========================================================================== */

const CACHE_VERSION = 'ifp-v1';
const PRECACHE = CACHE_VERSION + '-precache';
const RUNTIME = CACHE_VERSION + '-runtime';

/* Safe shell only — NEVER any article HTML. Versioned assets are pinned to the
 * current ?v and bump together with CACHE_VERSION; runtime cache-first backstops
 * any version not listed here. (site-background.css intentionally omitted — it
 * does not exist in the repo.) */
const PRECACHE_URLS = [
  '/offline.html',
  '/manifest.webmanifest',
  '/favicon.png?v=2',
  '/og-cover.jpg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-512-maskable.png',
  '/article.css?v=20260614d',
  '/css/fonts.css?v=20260614a',
  '/main.js?v=20260619a',
  '/fonts/sarabun-400-thai.woff2',
  '/fonts/amiri-400-arabic.woff2',
  '/fonts/ibm-plex-sans-thai-600-thai.woff2'
];

// --- install: precache shell (resilient — one bad asset won't fail install) ---
// NOTE: no skipWaiting() here on purpose — a new SW must WAIT so pwa-register.js
// can surface the "new version" toast; it activates only when the user taps it
// (postMessage 'SKIP_WAITING' below). clients.claim() in activate still lets the
// FIRST install control the page without a reload.
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(PRECACHE);
    await Promise.allSettled(PRECACHE_URLS.map((u) => cache.add(u)));
  })());
});

// --- activate: drop caches from older versions, take control ---
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// --- update toast handshake ---
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

// --- strategies -------------------------------------------------------------
const ASSET_RE = /\.(?:js|mjs|css|woff2?|ttf|otf|eot|png|jpe?g|webp|gif|svg|ico|mp4|webm)$/i;

function isHtml(request, url) {
  if (request.mode === 'navigate') return true; // covers extensionless article URLs
  const accept = request.headers.get('accept') || '';
  if (accept.includes('text/html')) return true;
  return /\.html$/i.test(url.pathname);
}

// HTML: network-first. Online → fresh (and refresh offline copy). Offline →
// cached copy if we have one, else /offline.html. NEVER serve cache while online.
async function htmlNetworkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(RUNTIME);
      cache.put(request, response.clone()); // offline fallback only
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    const offline = await caches.match('/offline.html');
    return offline || new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

// Immutable assets: cache-first (full URL incl ?v is the key, so a new ?v = miss = fresh).
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.status === 200 && response.type === 'basic') {
    const cache = await caches.open(RUNTIME);
    cache.put(request, response.clone());
  }
  return response;
}

// JSON: stale-while-revalidate.
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);
  return cached || (await network) || new Response('null', { headers: { 'Content-Type': 'application/json' } });
}

// --- router -----------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return; // never intercept non-GET

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // cross-origin → network-only

  if (isHtml(request, url)) {
    event.respondWith(htmlNetworkFirst(request));
    return;
  }
  if (/\.json$/i.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  if (ASSET_RE.test(url.pathname) || url.pathname === '/manifest.webmanifest') {
    event.respondWith(cacheFirst(request));
    return;
  }
  // Other same-origin GET: network-first, fall back to any cached copy.
  event.respondWith(
    fetch(request).catch(() => caches.match(request).then((c) => c || Response.error()))
  );
});
