const CACHE = 'truthteller-v4';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon.png',
  './js/element.js',
  './js/token.js',
  './js/function.js',
  './js/display.js',
  './js/parser.js',
  './js/engine.js',
  './js/app.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
