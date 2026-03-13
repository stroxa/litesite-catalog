const CACHE_NAME = "litesite-catalog-v1";

const CORE_ASSETS = [
  "./",
  "manifest.json",
  "s/css/catalog.css",
  "s/js/catalog.js",
  "icon.svg",
  "icon-192.png",
  "icon-512.png",
  "s/img/litesite-cover/litesite-brown-tr-index.jpg",
  "s/img/litesite-cover/litesite-blue-tr-index.jpg",
  "s/img/litesite-cover/litesite-red-tr-index.jpg",
  "s/img/litesite-cover/litesite-pink-tr-index.jpg",
];

const DETAIL_ASSETS = [
  "s/img/litesite-web/litesite-brown-tr-index.png",
  "s/img/litesite-web/litesite-brown-tr-product.png",
  "s/img/litesite-web/litesite-brown-en-index.png",
  "s/img/litesite-web/litesite-brown-en-product.png",
  "s/img/litesite-web/litesite-brown-ar-index.png",
  "s/img/litesite-web/litesite-brown-ar-product.png",
  "s/img/litesite-web/litesite-blue-tr-index.png",
  "s/img/litesite-web/litesite-blue-tr-product.png",
  "s/img/litesite-web/litesite-red-tr-index.png",
  "s/img/litesite-web/litesite-red-tr-product.png",
  "s/img/litesite-web/litesite-red-tr-hakkimizda.png",
  "s/img/litesite-web/litesite-red-tr-menu.png",
  "s/img/litesite-web/litesite-pink-tr-index.png",
  "s/img/litesite-web/litesite-pink-tr-product.png",
  "s/img/litesite-web/litesite-pink-tr-hakkimizda.png",
  "s/img/litesite-web/litesite-pink-tr-menu.png",
  "s/img/litesite-mobil/brown-tr-index.png",
  "s/img/litesite-mobil/brown-tr-product.png",
  "s/img/litesite-mobil/brown-en-index.png",
  "s/img/litesite-mobil/brown-en-product.png",
  "s/img/litesite-mobil/brown-ar-index.png",
  "s/img/litesite-mobil/brown-ar-product.png",
  "s/img/litesite-mobil/blue-tr-index.png",
  "s/img/litesite-mobil/blue-tr-product.png",
  "s/img/litesite-mobil/red-tr-index.png",
  "s/img/litesite-mobil/red-tr-product.png",
  "s/img/litesite-mobil/red-tr-hakkimizda.png",
  "s/img/litesite-mobil/red-tr-menu.png",
  "s/img/litesite-mobil/pink-tr-index.png",
  "s/img/litesite-mobil/pink-tr-product.png",
  "s/img/litesite-mobil/pink-tr-hakkimizda.png",
  "s/img/litesite-mobil/pink-tr-menu.png",
];

const CORE_PATHS = CORE_ASSETS.map(function(url) {
  return new URL(url, self.location).pathname;
});

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(c) {
      return c.addAll(CORE_ASSETS).then(function() {
        return Promise.allSettled(
          DETAIL_ASSETS.map(function(url) { return c.add(url); })
        );
      });
    }).then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("message", function(e) {
  if (e.data === "cache-all") {
    caches.open(CACHE_NAME).then(function(c) {
      Promise.allSettled(
        DETAIL_ASSETS.map(function(url) { return c.add(url); })
      );
    });
  }
});

self.addEventListener("fetch", function(e) {
  if (e.request.method !== "GET") { return; }

  const url = new URL(e.request.url);
  const isCore = CORE_PATHS.indexOf(url.pathname) !== -1;

  if (isCore) {
    e.respondWith(
      fetch(e.request).then(function(res) {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(function(c) { c.put(url.pathname, clone); });
        return res;
      }).catch(function() {
        return caches.match(url.pathname);
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function(cached) {
      const fetched = fetch(e.request).then(function(res) {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(function(c) { c.put(url.pathname, clone); });
        return res;
      }).catch(function() {
        return cached;
      });
      return cached || fetched;
    })
  );
});
