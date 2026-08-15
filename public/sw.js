/* C7: PWA asgari service worker — YALNIZCA uygulama kabuğu (statik dosyalar).
   Veri istekleri (Supabase, /api/*) ASLA önbelleğe alınmaz ve kuyruklanmaz (bkz. plan D1):
   offline yazma kuyruğu bilinçli olarak YOKTUR — çakışma penceresini büyütür. */
const CACHE = 'lole-shell-v1';
const SHELL = ['/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return; // yazmalar her zaman ağa gider
  if (url.origin !== self.location.origin) return; // Supabase/Anthropic vb. dokunulmaz
  if (url.pathname.startsWith('/api/')) return; // API her zaman ağdan
  // yalnızca kabuk dosyaları: cache-first; diğer her şey ağ (başarısızsa cache'e bakılır)
  if (SHELL.indexOf(url.pathname) !== -1) {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
  }
});
