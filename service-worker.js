const CACHE_NAME = 'todo-cache-v1';
const urlsToCache = [
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/assets/bird.jpg',
  '/assets/two.jpg'
];

// Install: cache files
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate: take control immediately
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Fetch: serve cached files first, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // Fallback to cached index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
