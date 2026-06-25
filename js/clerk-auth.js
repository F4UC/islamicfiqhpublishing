/**
 * Clerk auth — STEP 1: LOGIN / IDENTITY ONLY (no content gating yet).
 *
 * Loaded ONLY on the Hijri Time Machine page and the account page (login is
 * opt-in — free articles and the ijazah tool never load this). The client only
 * proves "who you are" and fetches a session token; the real entitlement check
 * happens server-side in functions/api/tm/* (and, later, D1). No Stripe here.
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
  // Publishable key is NON-SECRET (shipped to every browser); allowlist the scanner false positive.
  var PUBLISHABLE_KEY = 'pk_test_aW5maW5pdGUtcXVldHphbC0yLmNsZXJrLmFjY291bnRzLmRldiQ'; // gitleaks:allow
  var FRONTEND_API_HOST = 'infinite-quetzal-2.clerk.accounts.dev';

  /* Session-token getter for the gated API (sent as Authorization: Bearer <jwt>). */
  window.ifpGetToken = function () {
    return (window.Clerk && Clerk.session) ? Clerk.session.getToken() : Promise.resolve(null);
  };

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

  function mountAuth() {
    if (!window.Clerk) return;
    Clerk.load().then(function () {
      var box = document.getElementById('ifp-auth');
      var signin = document.getElementById('ifp-signin');
      var userbtn = document.getElementById('ifp-userbtn');
      if (box) box.hidden = false;
      if (Clerk.user) {
        if (signin) signin.hidden = true;
        if (userbtn) Clerk.mountUserButton(userbtn);
        verifySession();
      } else if (signin) {
        signin.hidden = false;
        signin.addEventListener('click', function () { Clerk.redirectToSignIn(); });
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
