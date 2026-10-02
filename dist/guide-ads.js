// Disabled builds do not include this script. The production CMP adapter must
// dispatch consent only after its own Google-certified integration is verified.
(() => {
  if (!/^\/guides\/[^/]+\/(?!index\.html$)[a-z-]+\.html$/.test(location.pathname)) return;
  const zone = document.querySelector('[data-guide-ad]');
  if (!zone || !/^ca-pub-\d{16}$/.test(zone.dataset.publisher || '') ||
      !/^\d+$/.test(zone.dataset.slot || '')) return;
  let requested = false;
  window.addEventListener('signtoki:ads-consent', event => {
    if (event.detail?.allowed !== true || requested) return;
    requested = true;
    zone.hidden = false;
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + zone.dataset.publisher;
    script.onload = () => { (window.adsbygoogle = window.adsbygoogle || []).push({}); };
    script.onerror = () => { zone.hidden = true; };
    document.head.appendChild(script);
  });
})();
