const CACHE_NAME = "litesite-catalog-v1";

const STATIC_ASSETS = [
  "./",
  "manifest.json",
  "s/css/catalog.css",
  "s/js/catalog.js",
  "icon.svg",
  "icon-192.png",
  "icon-512.png",
  "s/img/litesite-cover/litesite-brown-tr-index.webp",
  "s/img/litesite-cover/litesite-blue-tr-index.webp",
  "s/img/litesite-cover/litesite-red-tr-index.webp",
  "s/img/litesite-cover/litesite-pink-tr-index.webp",
];

function cacheAssetsSafely() {
  return caches.open(CACHE_NAME).then(function (cache) {
    return Promise.all(
      STATIC_ASSETS.map(function (url) {
        return cache.add(url).catch(function () {});
      })
    );
  });
}

function deleteOldCaches() {
  return caches.keys().then(function (cacheNames) {
    return Promise.all(
      cacheNames
        .filter(function (name) { return name !== CACHE_NAME; })
        .map(function (name) { return caches.delete(name); })
    );
  });
}

function fetchAndCache(request) {
  return fetch(request).then(function (networkResponse) {
    return caches.open(CACHE_NAME).then(function (cache) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    });
  });
}

function serveRequest(request) {
  return caches.match(request).then(function (cachedResponse) {
    if (cachedResponse) { return cachedResponse; }
    return fetchAndCache(request);
  });
}

self.addEventListener("install", function (event) {
  event.waitUntil(cacheAssetsSafely().then(function () {
    return self.skipWaiting();
  }));
});

self.addEventListener("activate", function (event) {
  event.waitUntil(deleteOldCaches().then(function () {
    return self.clients.claim();
  }));
});

self.addEventListener("fetch", function (event) {
  event.respondWith(serveRequest(event.request));
});
