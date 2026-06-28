const CACHE_NAME = 'anashealthcare-emergency-v1';

// Files needed for the Emergency page and Home page to work offline
const urlsToCache = [
  '/',
  '/emergency',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json',
];

// Install: cache the essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.log('Some files could not be cached:', err);
      });
    })
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
          return null;
        })
      );
    })
  );
});

// Fetch: serve from cache when offline, otherwise go to network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests for our own pages, not API calls
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If online, save a fresh copy to cache and return it
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // If offline, try to serve from cache
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match('/');
        });
      })
  );
});