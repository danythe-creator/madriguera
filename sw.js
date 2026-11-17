// Service worker: permite usar la app sin internet.
// Estrategia: red primero (para recibir siempre la versión nueva) y, si no hay conexión, la copia guardada.
const CACHE = 'madriguera-v9';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'css/styles.css',
  'js/main.js', 'js/util.js', 'js/state.js', 'js/srs.js', 'js/speech.js', 'js/answers.js', 'js/letters.js', 'js/router.js', 'js/petsvg.js',
  'js/data/units.js', 'js/data/config.js', 'js/data/shop.js',
  'js/content/index.js', 'js/content/a2/routine.js', 'js/content/a2/past.js', 'js/content/a2/restaurant.js', 'js/content/a2/plans.js', 'js/content/a2/compare.js',
  'js/engine/path.js', 'js/engine/listen.js', 'js/engine/build.js', 'js/engine/runner.js', 'js/data/changelog.js', 'js/data/scenes.js',
  'js/views/home.js', 'js/views/units.js', 'js/views/lesson.js', 'js/views/collection.js', 'js/views/shop.js', 'js/views/yard.js', 'js/views/letters.js', 'js/views/news.js', 'js/views/settings.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const timeout = (ms, p) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Tipografías de Google: caché primero (casi nunca cambian).
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
    })));
    return;
  }
  if (url.origin !== location.origin) return;
  e.respondWith(
    timeout(4000, fetch(req)).then(res => {
      if (res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('index.html')))
  );
});
