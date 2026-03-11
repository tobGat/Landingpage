const CACHE_NAME = 'schulapps-v4';
const ASSETS = [
  '/logo_schulapps.png',
  '/ssc_logo.png',
  '/grupo_logo.png',
  '/grupo_schriftzug.png',
  '/frogmi_logo.png',
  '/cloudia_logo.svg',
  '/votr_logo.svg',
  '/crossi_logo.png',
  '/favicon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // HTML: immer vom Netzwerk holen (damit Updates sofort sichtbar sind)
  if (request.mode === 'navigate' || request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Assets: Cache-first
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
