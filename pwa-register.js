/* Service-worker registration + "new version" update toast.
 * Loaded only on entrypoints (index/404/pages/template); once the SW installs it
 * controls the whole "/" scope including article pages. No external deps; static
 * strings only (textContent, never innerHTML). Palette: navy/blue/white (no gold). */
(function () {
  if (!('serviceWorker' in navigator)) return;

  function showUpdateToast(worker) {
    if (document.getElementById('ifp-update-toast')) return;

    var toast = document.createElement('button');
    toast.id = 'ifp-update-toast';
    toast.type = 'button';
    toast.textContent = 'มีเวอร์ชันใหม่ — แตะเพื่ออัปเดต';
    toast.setAttribute('aria-live', 'polite');
    toast.style.cssText = [
      'position:fixed', 'left:50%', 'bottom:24px', 'transform:translateX(-50%) translateY(12px)',
      'z-index:2147483647', 'max-width:calc(100vw - 32px)',
      'background:#06101e', 'color:#ffffff', 'border:1px solid #3b82f6', 'border-radius:12px',
      'padding:13px 22px', 'font-family:"IBM Plex Sans Thai",system-ui,sans-serif',
      'font-size:14px', 'font-weight:600', 'cursor:pointer', 'box-shadow:0 8px 28px rgba(0,0,0,0.45)',
      'opacity:0', 'transition:opacity .25s ease, transform .25s ease'
    ].join(';');

    toast.addEventListener('click', function () {
      toast.disabled = true;
      toast.textContent = 'กำลังอัปเดต…';
      if (worker) worker.postMessage('SKIP_WAITING');
    });

    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
  }

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function (reg) {
      if (reg.waiting && navigator.serviceWorker.controller) showUpdateToast(reg.waiting);

      reg.addEventListener('updatefound', function () {
        var nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', function () {
          // A new worker has installed while an old one controls the page.
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateToast(nw);
          }
        });
      });
    }).catch(function () { /* registration failed — site still works without SW */ });

    var refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
})();
