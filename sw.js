// The Burg service worker: offline app shell, served straight from the versioned cache.
// Bump nothing by hand: the release kit stamps the version in. A new version means a changed sw.js, which the
// browser checks on its own; the new worker downloads every file fresh, then the old cache is removed.
const CACHE_PREFIX = 'theburg-';          // the release kit makes this 'theburgbeta-' in the beta
const VERSION = CACHE_PREFIX + '0.1.0';
const CACHE = VERSION;
const ASSETS = ['./', './index.html', './js/state.js', './js/difficulty.js', './js/ui.js', './js/turn.js', './js/events.js', './js/features.js', './js/outabout.js', './js/townpack1.js', './js/health.js', './js/weather.js', './js/starts.js', './js/maps.js', './js/help.js', './js/owner.js', './js/boot.js', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];

// i57-a13: only keep a response that really is the file asked for, so a hotel or airport Wi-Fi login page
// (a redirect, or a 200 page of HTML in place of a script) can never become the offline game.
// Pages must be HTML and scripts must be JavaScript; anything else (icons, the manifest) just must not be HTML.
function good(req, res){
  if (!res || !res.ok || res.redirected || res.type !== 'basic') return false;
  const path = new URL(req.url).pathname, type = res.headers.get('content-type') || '';
  if (req.mode === 'navigate' || /(\/|\.html)$/.test(path)) return /text\/html/.test(type);
  if (/\.m?js$/.test(path)) return /javascript/.test(type);
  if (/\.css$/.test(path)) return /text\/css/.test(type);
  return !/text\/html/.test(type);
}

self.addEventListener('install', e => {
  // cache: 'reload' skips the browser's own HTTP cache, so a new version never keeps an old file.
  // i3-b08: the first install takes over at once; a new version waits until the player taps "Update ready"
  // (the page posts 'skip'), so new files never mix with old ones in the middle of a week
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(ASSETS.map(u => {
    const req = new Request(u, { cache: 'reload' });
    return fetch(req).then(res => { if (!good(req, res)) throw new Error('bad ' + u); return c.put(u, res); });
  }))).then(() => self.registration.active ? undefined : self.skipWaiting()));
});

self.addEventListener('message', e => { if (e.data && e.data.type === 'skip') self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// i43-b02: cache first, no background refresh, so a normal launch downloads nothing.
// i54-a13: a page opened with ?something (a home-screen link, a shared link) is still the cached game.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const nav = req.mode === 'navigate';
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(req, { ignoreSearch: nav }) || (nav ? await c.match('./index.html') || await c.match('./') : null);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (good(req, res)) c.put(req, res.clone());
      return res;
    } catch (err) {
      return Response.error();
    }
  }));
});
