self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    event.waitUntil(
      caches.open('app-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/Vite.js.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });  