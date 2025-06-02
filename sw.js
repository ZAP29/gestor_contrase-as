self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open('clavefacil-v1').then(cache =>
      cache.addAll([
        './',
        './index.html',
        './css/styles.css',
        './js/app.js',
        './js/db.js',
        './js/worker.js',
        './manifest.json',
        './icons/icon-192.png', // reemplaza con tu icono real
        './icons/icon-512.png'
      ])
    )
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
