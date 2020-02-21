// Cache Version
const CACHE_NAME = 'wtg-0.1';

// Resources
const urlsToCache = [
    '/',
    '/index.html',
    '/css/index.css',
    '/src/animation.js',
    '/src/config.js',
    '/src/game.js',
    '/src/index.js',
    '/src/utils.js',
];

// On Install, Cache Files
self.addEventListener('install', event => event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
));

// On Fetch, Get from Cache or fetch
self.addEventListener('fetch', e =>
    e.respondWith(caches.match(e.request).then(r => {
        if (r) return r;
        else return fetch(e.request).then(rr => {
            if (!rr || rr.status !== 200 || rr.type !== 'basic')
                return rr;
            const res = rr.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, res));
            return rr;
        });
    })));

// On Activate, Clear Cache
self.addEventListener('activate', e => e.waitUntil(caches.keys()
    .then((cnames) => Promise.all(cnames.map(cname => caches.delete(cname))))));
