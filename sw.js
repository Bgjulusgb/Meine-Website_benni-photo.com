// Service Worker für PWA (Progressive Web App)
// Todo #18 Implementation

const CACHE_NAME = 'bg-photography-v1';
const RUNTIME_CACHE = 'bg-runtime';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/about.html',
  '/portfolio.html',
  '/services.html',
  '/contact.html',
  '/sports.html',
  '/music.html',
  '/styles.css',
  '/script.js',
  '/manifest.json'
];

// Install event - precache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map(name => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return caches.open(RUNTIME_CACHE)
            .then(cache => {
              return fetch(event.request)
                .then(response => {
                  // Cache successful responses
                  if (response.status === 200) {
                    cache.put(event.request, response.clone());
                  }
                  return response;
                })
                .catch(() => {
                  // Offline fallback
                  if (event.request.destination === 'document') {
                    return caches.match('/offline.html');
                  }
                });
            });
        })
    );
  }
});
