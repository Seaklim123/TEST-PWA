const CACHE_NAME = "todo-cache-v1";

const urlsToCache = [
  "index.html",
  "Css/style.css",
  "Javascript/app.js",
  "Assets/bird.jpg",
  "Assets/two.jpg"
];

self.addEventListener("install", event => {
  self.skipWaiting(); // activate right away
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        if (event.request.destination === "document") {
          return caches.match("index.html");
        }
      });
    })
  );
});
