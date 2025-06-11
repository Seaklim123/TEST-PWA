const CACHE_NAME = "todo-cache-v1";

// IMPORTANT: These URLs MUST exactly match the paths served by your local server.
// If index.html is at /Html/index.html, use that. If it's at /index.html, use that.
const urlsToCache = [
  "/index.html",     // Adjust this path if your index.html is at root, e.g., "/index.html"
  "/Css/style.css",
  "/Javascript/app.js",
  // "/Javascript/manifest.json", // REMOVE THIS LINE IF YOU HAVE IT
  "/Assets/bird.jpg",
  "/Assets/two.jpg"
];

self.addEventListener('install', event => {
  self.skipWaiting(); // activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim()); // take control immediately
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
