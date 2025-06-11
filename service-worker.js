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
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache)
          .catch(error => {
            console.error('[Service Worker] Failed to cache URLs:', error);
            // Log individual URLs that failed
            urlsToCache.forEach(url => {
                caches.match(url).then(response => {
                    if (!response) console.error(`[Service Worker] Failed to cache: ${url}`);
                });
            });
          });
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
      console.log('[Service Worker] Activated and claimed clients.');
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log(`[Service Worker] Serving from cache: ${event.request.url}`);
          return response;
        }
        console.log(`[Service Worker] Fetching from network: ${event.request.url}`);
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            let responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          })
          .catch(error => {
            console.error(`[Service Worker] Fetch failed for ${event.request.url}:`, error);
            // Optional: return a fallback page or asset here if needed
            // e.g., if (event.request.mode === 'navigate') return caches.match('/offline.html');
          });
      })
  );
});