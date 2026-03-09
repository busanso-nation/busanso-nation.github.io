const CACHE_NAME = "busanso-image-cache-v1";

/* INSTALL */
self.addEventListener("install", event => {
  self.skipWaiting();
});

/* ACTIVATE */
self.addEventListener("activate", event => {
  self.clients.claim();
});

/* FETCH (IMAGE CACHING ONLY) */
self.addEventListener("fetch", event => {

  const request = event.request;

  // Only cache images like posters/logos
  if (request.destination === "image") {

    event.respondWith(
      caches.match(request).then(cached => {

        if (cached) {
          return cached;
        }

        return fetch(request).then(networkResponse => {

          const clone = networkResponse.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, clone);
          });

          return networkResponse;

        }).catch(() => cached);
      })
    );

  }

});
