const CACHE_NAME = 'sumaq-diplomas-v1';
const RUNTIME_CACHE = 'sumaq-runtime-v1';

// Archivos críticos para cachear inmediatamente
const PRECACHE_URLS = [
    '/',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Precaching app shell');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => {
                        return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
                    })
                    .map((cacheName) => {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Estrategia de caché: Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip cross-origin requests
    if (!request.url.startsWith(self.location.origin)) {
        return;
    }

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.open(RUNTIME_CACHE).then((cache) => {
            return fetch(request)
                .then((response) => {
                    // Si la respuesta es válida, cachearla
                    if (response && response.status === 200) {
                        cache.put(request, response.clone());
                    }
                    return response;
                })
                .catch(() => {
                    // Si falla la red, intentar con cache
                    return caches.match(request).then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }

                        // Si no está en cache, devolver página offline
                        if (request.destination === 'document') {
                            return caches.match('/');
                        }

                        // Para otros recursos, devolver response vacía
                        return new Response('', {
                            status: 408,
                            statusText: 'Request Timeout'
                        });
                    });
                });
        })
    );
});

// Manejo de mensajes desde la app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Sync en background (para futuras funcionalidades)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-diplomas') {
        event.waitUntil(syncDiplomas());
    }
});

async function syncDiplomas() {
    console.log('[SW] Syncing diplomas...');
    // Aquí se puede implementar sincronización de datos
}
