// The Burg service worker: offline app shell (cache-first, refreshed in background).
// Bump nothing by hand: the release kit stamps the version in.
const CACHE_PREFIX = 'theburg-';          // the release kit makes this 'theburgbeta-' in the beta
const VERSION = CACHE_PREFIX + '0.1.0';
const CACHE = VERSION;
const ASSETS = ['./', './index.html', './js/state.js', './js/ui.js', './js/turn.js', './js/events.js', './js/features.js', './js/outabout.js', './js/health.js', './js/weather.js', './js/maps.js', './js/help.js', './js/boot.js', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => {
      const net = fetch(e.request).then(res => {
        if (res && res.ok && new URL(e.request.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
