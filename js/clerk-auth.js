/**
 * Clerk auth — STEP 1: LOGIN / IDENTITY ONLY (no content gating yet).
 *
 * Loaded site-wide (injected by main.js right after the central header mounts) so
 * the avatar / sign-in button appears in the header chrome on every page. The
 * client only proves "who you are" and fetches a session token; the real
 * entitlement check happens server-side in functions/api/tm/* (and D1). No Stripe here.
 *
 * ⚑ CONFIG — One must fill these two values from the Clerk dashboard
 *    (app_3FchX2P8bM4RbPyfuNFsMHdGBkV → API keys / Frontend API) before deploy:
 *      • PUBLISHABLE_KEY  (pk_…)  — NON-SECRET, belongs client-side.
 *      • FRONTEND_API_HOST (the instance's Frontend API host, e.g.
 *        "xxxx.clerk.accounts.dev" for dev, "clerk.islamicfiqhpublishing.com"
 *        for production).
 *    The SECRET key (sk_…) must NEVER appear in this file or anywhere client-side —
 *    it is a Cloudflare Pages secret read only by the Function.
 *
 * Until both are configured, this script no-ops (the page works without auth).
 */
(function () {
  // Idempotent: main.js loads this site-wide, but some pages may also include it
  // directly — never double-init Clerk.
  if (window.__ifpClerkInit) return;
  window.__ifpClerkInit = true;

  // Publishable key is NON-SECRET (shipped to every browser); allowlist the scanner false positive.
  var PUBLISHABLE_KEY = 'pk_test_aW5maW5pdGUtcXVldHphbC0yLmNsZXJrLmFjY291bnRzLmRldiQ'; // gitleaks:allow
  var FRONTEND_API_HOST = 'infinite-quetzal-2.clerk.accounts.dev';

  /* Session-token getter for the gated API (sent as Authorization: Bearer <jwt>). */
  window.ifpGetToken = function () {
    return (window.Clerk && Clerk.session) ? Clerk.session.getToken() : Promise.resolve(null);
  };

  /* P2: sign-in/up stubs — queue clicks that arrive before Clerk.load() resolves,
     then drain them (real redirect) once Clerk is ready. tmSignIn()/tmSignUp() in
     the page call these via window.ifpSignIn/ifpSignUp first, so they're always used
     before the hard Clerk fallback. */
  var _authQueue = [];
  window.ifpSignIn = function () { _authQueue.push('in'); };
  window.ifpSignUp = function () { _authQueue.push('up'); };

  /* STEP-1 self-check: prove the gated path works (200 { userId } when signed in). */
  function verifySession() {
    window.ifpGetToken().then(function (token) {
      if (!token) return;
      fetch('/api/tm/whoami', { headers: { Authorization: 'Bearer ' + token } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { if (d) console.log('[ifp-auth] session verified:', d); })
        .catch(function () { /* network/optional — never block the page */ });
    });
  }

  /* Render the membership tier pill next to the avatar (Part 4). Reads /api/tm/me
     with the session token; cached per signed-in session so listener churn (token
     refresh) doesn't re-hit the API. Hidden + cleared when signed out. */
  function renderTierBadge() {
    var el = document.getElementById('ifp-tier');
    if (!el) return;
    if (el.getAttribute('data-loaded') === '1') return; // already shown this session
    window.ifpGetToken().then(function (token) {
      if (!token) { clearTierBadge(); return; }
      fetch('/api/tm/me', { headers: { Authorization: 'Bearer ' + token } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (!d || !d.authed) { clearTierBadge(); return; }
          var label = d.tier === 'pro' ? 'FIQH PRO' : (d.tier === 'plus' ? 'FIQH+' : 'FIQH');
          el.textContent = label;
          el.hidden = false;
          el.setAttribute('data-loaded', '1');
        })
        .catch(function () { /* badge optional — never block the page */ });
    });
  }
  function clearTierBadge() {
    var el = document.getElementById('ifp-tier');
    if (el) { el.hidden = true; el.textContent = ''; el.removeAttribute('data-loaded'); }
  }

  var _verifiedOnce = false;

  /* Single source of truth for the header auth chrome. Re-queries the (async-
     injected) header elements on EVERY call so it works no matter when the header
     mounts, and is safe to run repeatedly (Clerk.addListener fires it on every
     sign-in / sign-out / token refresh). */
  function applyAuthUI() {
    if (!window.Clerk) return;
    var box = document.getElementById('ifp-auth');
    var signin = document.getElementById('ifp-signin');
    var userbtn = document.getElementById('ifp-userbtn');
    var signedIn = !!Clerk.user;
    if (box) box.hidden = false;

    if (signin && !signin.__ifpBound) {
      signin.addEventListener('click', function () { Clerk.redirectToSignIn(); });
      signin.__ifpBound = true;
    }

    if (signedIn) {
      if (signin) signin.hidden = true;
      if (userbtn && !userbtn.__ifpUserBtnMounted) {
        Clerk.mountUserButton(userbtn);
        userbtn.__ifpUserBtnMounted = true; // guard: never double-mount
      }
      renderTierBadge();
      if (!_verifiedOnce) { _verifiedOnce = true; verifySession(); }
    } else {
      if (signin) signin.hidden = false;
      if (userbtn && userbtn.__ifpUserBtnMounted) {
        try { Clerk.unmountUserButton(userbtn); } catch (_) {}
        userbtn.__ifpUserBtnMounted = false;
      }
      if (userbtn) userbtn.innerHTML = '';
      clearTierBadge();
    }

    /* Let pages (account card, ijazah re-lock, TM mirror) react to EVERY change —
       login AND logout — not just the initial load. */
    window.dispatchEvent(new CustomEvent('ifp:authready', { detail: { signedIn: signedIn } }));
  }

  function mountAuth() {
    if (!window.Clerk) return;
    Clerk.load().then(function () {
      /* Replace queue stubs with live redirects, then drain any queued clicks. */
      window.ifpSignIn = function () { Clerk.redirectToSignIn(); };
      window.ifpSignUp = function () { Clerk.redirectToSignUp(); };
      var q = _authQueue.splice(0);
      q.forEach(function (a) { a === 'in' ? Clerk.redirectToSignIn() : Clerk.redirectToSignUp(); });

      applyAuthUI();                  // initial paint
      Clerk.addListener(applyAuthUI); // re-run on every auth / session change

      /* The header is injected asynchronously by main.js; on pages that load this
         script directly it may not exist yet. Re-apply once #ifp-auth appears, then
         disconnect — a single observer feeding the same applyAuthUI path. */
      if (!document.getElementById('ifp-auth')) {
        var mo = new MutationObserver(function () {
          if (document.getElementById('ifp-auth')) { mo.disconnect(); applyAuthUI(); }
        });
        mo.observe(document.documentElement, { childList: true, subtree: true });
      }
    }).catch(function () { /* auth optional in STEP 1 — never block the timeline */ });
  }

  /* Don't even attempt to load Clerk until configured, so placeholders never
     break the page or spam the console with failed requests. */
  if (PUBLISHABLE_KEY.indexOf('REPLACE_WITH') !== -1 || FRONTEND_API_HOST.indexOf('REPLACE_WITH') !== -1) {
    console.warn('[ifp-auth] Clerk not configured — set PUBLISHABLE_KEY + FRONTEND_API_HOST in js/clerk-auth.js');
    return;
  }

  /* Load Clerk's clerk-js from the instance Frontend API (CSP allows
     https://*.clerk.accounts.dev). Injecting the script keeps the pk + host in
     this one shared file instead of duplicated inline in every page. */
  var s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.setAttribute('data-clerk-publishable-key', PUBLISHABLE_KEY);
  s.src = 'https://' + FRONTEND_API_HOST + '/npm/@clerk/clerk-js@5/dist/clerk.browser.js';
  s.addEventListener('load', mountAuth);
  document.head.appendChild(s);
})();
