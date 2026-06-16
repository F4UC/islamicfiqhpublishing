/* ============================================================================
 * scrub-hero.js — Scroll-scrub hero (image-sequence on <canvas>), Baghdad theme.
 * Vanilla, self-hosted, CSP-safe (no GSAP/Lenis/three/CDN). Initialises in
 * isolation — does NOT touch main.js (beacon / theme / Arabic / ijazah).
 *
 * Mechanism (Apple-style): iOS Safari cannot seek <video>.currentTime smoothly,
 * so the clip is decoded to an AVIF/WebP image-sequence and drawn to a <canvas>
 * keyed on scroll position. Progressive enhancement: the poster <img> + real
 * text tagline + crawlable <main> directory work with no JS at all.
 * ========================================================================== */
(function () {
  'use strict';

  var FRAMES = 60;                                  // seq_000 … seq_059
  var BASE = '/assets/hero-baghdad/seq_';
  var SCRUB_VH = 400;                               // section height when scrubbing

  var hero = document.querySelector('.bg-hero');
  if (!hero) return;
  var canvas = hero.querySelector('.bg-hero__canvas');
  if (!canvas) return;

  /* ---- 1. feature gate (decide before doing any work) ------------------- */
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function gated() {
    if (mq && mq.matches) return true;                                  // reduced-motion
    var c = navigator.connection || navigator.webkitConnection || null;
    if (c) {
      if (c.saveData) return true;                                      // data-saver
      if (/(^|-)2g$/.test(c.effectiveType || '')) return true;          // slow link
    }
    // mobile / low-power heuristic: coarse pointer + narrow viewport
    var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (coarse && Math.min(window.innerWidth, window.innerHeight) < 600) return true;
    if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true;
    return false;
  }
  if (gated()) return;                              // poster stays; no canvas, no scroll work

  /* ---- 2. pick a supported sequence format (AVIF → WebP) ----------------- */
  function supportsAvif() {
    try {
      var c = document.createElement('canvas');
      return c.getContext && c.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    } catch (e) { return false; }
  }
  var EXT = supportsAvif() ? '.avif' : '.webp';

  var ctx = canvas.getContext('2d', { alpha: false });
  var imgs = new Array(FRAMES);
  var loaded = 0, ready = false, curIdx = -1, raf = 0;

  function sizeCanvas() {
    var r = hero.querySelector('.bg-hero__sticky').getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
  }

  function drawCover(img) {
    if (!img || !img.width) return;
    var cw = canvas.width, ch = canvas.height;
    var ir = img.width / img.height, cr = cw / ch, dw, dh, dx, dy;
    if (cr > ir) { dw = cw; dh = cw / ir; } else { dh = ch; dw = ch * ir; }
    dx = (cw - dw) / 2; dy = (ch - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function frameAt(progress) {
    return Math.max(0, Math.min(FRAMES - 1, Math.round(progress * (FRAMES - 1))));
  }

  function render() {
    raf = 0;
    var rect = hero.getBoundingClientRect();
    var total = hero.offsetHeight - window.innerHeight;     // scrollable distance
    var progress = total > 0 ? (-rect.top) / total : 0;
    progress = Math.max(0, Math.min(1, progress));
    var idx = frameAt(progress);
    if (idx === curIdx) return;                              // draw only on change
    var img = imgs[idx];
    if (img && img.complete && img.naturalWidth) { drawCover(img); curIdx = idx; }
  }
  function onScroll() { if (!raf && ready) raf = requestAnimationFrame(render); }

  /* ---- 3. preload sequence after first paint / when hero nears viewport -- */
  function preload() {
    for (var i = 0; i < FRAMES; i++) {
      (function (i) {
        var im = new Image();
        im.decoding = 'async';
        im.onload = im.onerror = function () {
          loaded++;
          if (i === 0) { sizeCanvas(); drawCover(im); curIdx = 0; }  // first frame ASAP
          if (loaded === FRAMES && !ready) {
            ready = true;
            hero.classList.add('is-ready');                  // fades canvas in over poster
            sizeCanvas(); render();
          }
        };
        im.src = BASE + String(i).padStart(3, '0') + EXT;
        imgs[i] = im;
      })(i);
    }
  }

  function activate() {
    hero.classList.add('is-scrub');                          // 100vh → 400vh (only now)
    hero.style.setProperty('--scrub-vh', SCRUB_VH + 'vh');
    preload();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      sizeCanvas(); curIdx = -1; if (ready) render();
    }, { passive: true });
    if (mq && mq.addEventListener) mq.addEventListener('change', function (e) {
      if (e.matches) {  // user switched to reduced-motion mid-session → stand down
        window.removeEventListener('scroll', onScroll);
        hero.classList.remove('is-scrub', 'is-ready');
      }
    });
  }

  // Only spin up when the hero is actually near/in the viewport.
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); activate(); }
    }, { rootMargin: '200px' });
    io.observe(hero);
  } else {
    activate();
  }
})();
