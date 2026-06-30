/**
 * First-party auth client (Phase 2 cutover) — replaces js/clerk-auth.js as the
 * site-wide loaded script. The gate now reads our own __Host-ifp_sess cookie
 * (functions/_lib/auth.js verifyUserBySession); this file drives the header chrome
 * and the sign-in surfaces. All API calls are same-origin with credentials:'include'
 * (cookie). No Bearer tokens; window.ifpGetToken is intentionally gone.
 *
 * Clerk is kept installed for rollback but is NOT loaded by this file.
 * Never logs tokens/cookies/challenges.
 */
(function () {
  if (window.__ifpAuthInit) return;     // idempotent: loaded site-wide + maybe per-page
  window.__ifpAuthInit = true;

  /* ---- session ---- */
  // GET /api/tm/me with the cookie → { authed, tier, planTitle, ... }. Never throws.
  window.ifpGetSession = function () {
    return fetch('/api/tm/me', { credentials: 'include', cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  };

  /* ---- sign in / out ---- */
  window.ifpSignIn = function () { window.location.href = '/login'; };
  window.ifpSignUp = window.ifpSignIn;   // alias kept for any legacy caller
  window.ifpSignOut = function () {
    return fetch('/api/auth/signout', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      .catch(function () {})
      .then(function () { window.location.href = '/'; });
  };

  /* ---- base64url helpers (WebAuthn) ---- */
  function b64urlToBuf(s) {
    s = String(s).replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    var bin = atob(s), u = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return u.buffer;
  }
  function bufToB64url(buf) {
    var u = new Uint8Array(buf), s = '';
    for (var i = 0; i < u.length; i++) s += String.fromCharCode(u[i]);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function postJSON(url, obj) {
    return fetch(url, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj || {}),
    }).then(function (r) { return r.json().catch(function () { return { ok: false }; }); });
  }

  /* Add a passkey to the CURRENT account (must be signed in). Resolves true/false. */
  window.ifpRegisterPasskey = async function () {
    if (!window.PublicKeyCredential) return false;
    try {
      var opts = await postJSON('/api/auth/passkey/register/start', {});
      if (!opts || opts.ok === false) return false;
      opts.challenge = b64urlToBuf(opts.challenge);
      opts.user.id = b64urlToBuf(opts.user.id);
      if (opts.excludeCredentials) opts.excludeCredentials = opts.excludeCredentials.map(function (c) { c.id = b64urlToBuf(c.id); return c; });
      var cred = await navigator.credentials.create({ publicKey: opts });
      var body = {
        id: cred.id, rawId: bufToB64url(cred.rawId), type: cred.type,
        clientExtensionResults: cred.getClientExtensionResults ? cred.getClientExtensionResults() : {},
        response: {
          clientDataJSON: bufToB64url(cred.response.clientDataJSON),
          attestationObject: bufToB64url(cred.response.attestationObject),
          transports: cred.response.getTransports ? cred.response.getTransports() : [],
        },
      };
      var fin = await postJSON('/api/auth/passkey/register/finish', body);
      return !!(fin && fin.ok);
    } catch (e) { return false; }
  };

  /* Sign in with a discoverable passkey. Resolves true/false (caller redirects). */
  window.ifpSignInWithPasskey = async function () {
    if (!window.PublicKeyCredential) return false;
    try {
      var opts = await postJSON('/api/auth/passkey/login/start', {});
      if (!opts || opts.ok === false) return false;
      opts.challenge = b64urlToBuf(opts.challenge);
      if (opts.allowCredentials) opts.allowCredentials = opts.allowCredentials.map(function (c) { c.id = b64urlToBuf(c.id); return c; });
      var a = await navigator.credentials.get({ publicKey: opts });
      var resp = {
        clientDataJSON: bufToB64url(a.response.clientDataJSON),
        authenticatorData: bufToB64url(a.response.authenticatorData),
        signature: bufToB64url(a.response.signature),
      };
      if (a.response.userHandle) resp.userHandle = bufToB64url(a.response.userHandle);
      var body = {
        id: a.id, rawId: bufToB64url(a.rawId), type: a.type,
        clientExtensionResults: a.getClientExtensionResults ? a.getClientExtensionResults() : {},
        response: resp,
      };
      var fin = await postJSON('/api/auth/passkey/login/finish', body);
      return !!(fin && fin.ok);
    } catch (e) { return false; }
  };

  /* ---- header chrome ---- */
  function tierLabel(t) { return t === 'pro' ? 'FIQH PRO' : (t === 'plus' ? 'FIQH+' : 'FIQH'); }

  // Build the avatar + dropdown menu into #ifp-userbtn once (static markup, no data).
  function mountUserMenu(userbtn) {
    if (!userbtn || userbtn.__ifpMounted) return;
    userbtn.__ifpMounted = true;
    userbtn.innerHTML =
      '<button type="button" class="ifp-avatar" id="ifp-avatar" aria-haspopup="true" aria-expanded="false" aria-label="บัญชีผู้ใช้">' +
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>' +
      '</button>' +
      '<div class="ifp-menu" id="ifp-menu" hidden>' +
        '<a href="/pages/account.html" class="ifp-menu-item">บัญชี</a>' +
        '<button type="button" class="ifp-menu-item" id="ifp-signout">ออกจากระบบ</button>' +
      '</div>';
    var avatar = userbtn.querySelector('#ifp-avatar');
    var menu = userbtn.querySelector('#ifp-menu');
    avatar.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !menu.hidden;
      menu.hidden = open;
      avatar.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    userbtn.querySelector('#ifp-signout').addEventListener('click', function () { window.ifpSignOut(); });
    document.addEventListener('click', function (e) { if (!userbtn.contains(e.target)) { menu.hidden = true; avatar.setAttribute('aria-expanded', 'false'); } });
  }

  // Single source of truth for the header. Re-queries the async-injected elements;
  // safe to call repeatedly. Cookie-based (no token).
  function applyAuthUI() {
    var box = document.getElementById('ifp-auth');
    var signin = document.getElementById('ifp-signin');
    var userbtn = document.getElementById('ifp-userbtn');
    var tier = document.getElementById('ifp-tier');
    if (!box && !signin && !userbtn) return; // header not mounted yet
    if (box) box.hidden = false;
    if (signin && !signin.__ifpBound) { signin.addEventListener('click', window.ifpSignIn); signin.__ifpBound = true; }

    window.ifpGetSession().then(function (sess) {
      var signedIn = !!(sess && sess.authed);
      if (signedIn) {
        if (signin) signin.hidden = true;
        mountUserMenu(userbtn);
        if (tier) { tier.textContent = tierLabel(sess.tier); tier.hidden = false; }
      } else {
        if (signin) signin.hidden = false;
        if (userbtn) { userbtn.innerHTML = ''; userbtn.__ifpMounted = false; }
        if (tier) { tier.hidden = true; tier.textContent = ''; }
      }
      window.dispatchEvent(new CustomEvent('ifp:authready', { detail: { signedIn: signedIn } }));
    });
  }
  window.ifpApplyAuthUI = applyAuthUI;

  function boot() {
    if (document.getElementById('ifp-auth')) { applyAuthUI(); return; }
    // Header is injected asynchronously by main.js — apply once it appears.
    var mo = new MutationObserver(function () {
      if (document.getElementById('ifp-auth')) { mo.disconnect(); applyAuthUI(); }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
