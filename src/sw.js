workbox.setConfig({
  debug: true
});

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

const PRECACHE_FALLBACK_CACHE = 'fallback-assets';

function log(msg) {
  console.log(`[SW] ${msg}`);
}

// create 'fallback' cache by removing hashes
async function createFallbackPrecache() {
  log(`Creating fallback precache...`);

  const preCache = await caches.open(workbox.core.cacheNames.precache);

  self.__precacheManifest.forEach(async(file) => {
    let [url, name, hash, extension] = file.url.match(/(\w*)-bundle\.(\w*)\.(\w*)/);

    const response = await preCache.match(
      workbox.precaching.getCacheKeyForURL(file.url)
    );

    caches.open(PRECACHE_FALLBACK_CACHE).then(cache => {
      cache.put(`${name}-bundle.${extension}`, response.clone());
    });

  });
}

// route will only be called if bundle is not found in precache
workbox.routing.registerRoute(
  /-bundle\.\w*\.js$/,
  async({ url }) => {
  	log(`Did not find ${url.pathname} in precache`);

    return fetch(url).then(function(response) {
      if (!response.ok) {
        let [fullURL, name, hash, extension] = url.pathname.match(/(\w*)-bundle\.(\w*)\.(\w*)/);
        let backupFile = `${name}-bundle.${extension}`;

        log(`Failed to fetch ${url.pathname}, checking fallback cache for bundle '${url.pathname}'...`);

        return caches.open(PRECACHE_FALLBACK_CACHE).then(function(cache) {
          return cache.match(backupFile).then(function(cachedResponse) {
            return cachedResponse || response;
          });
        });
      } else
        return response;
    });
  }
);

self.addEventListener('activate', (event) => {
  log(`Activate event`);
  createFallbackPrecache();
});