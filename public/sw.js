/* C7: PWA asgari service worker — YALNIZCA uygulama kabuğu (statik dosyalar).
   Veri istekleri (Supabase, /api/*) ASLA önbelleğe alınmaz ve kuyruklanmaz (bkz. plan D1):
   offline yazma kuyruğu bilinçli olarak YOKTUR — çakışma penceresini büyütür. */
const CACHE = 'lole-shell-v3'; // v42: sürüm artırıldı — eski önbellek activate'te temizlenir

/* v42 DEĞİŞİKLİK — GÜNCELLEMELER ARTIK İLK YENİLEMEDE GELİYOR
   Eskiden uygulamanın kendisi (/ ve /engine.js) "stale-while-revalidate" ile sunuluyordu:
   yeni sürüm yayınlandığında kullanıcı ÖNCE eski dosyayı görüyor, yenisi ancak BİR SONRAKİ
   açılışta geliyordu. "Ctrl+F5 yaptım ama değişmedi" şikâyetinin sebebi buydu.
   Artık uygulama dosyaları ÖNCE AĞDAN alınıyor; ağ yoksa önbellekten açılıyor.
   Böylece hem güncelleme anında geliyor hem çevrimdışı açılış çalışmaya devam ediyor. */
const APP = ['/', '/engine.js'];                              // önce ağ, olmazsa önbellek
const STATIC = ['/manifest.json', '/icon-192.png', '/icon-512.png']; // önce önbellek (değişmiyorlar)
const SHELL = APP.concat(STATIC);

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
  if (e.request.method !== 'GET') return;                  // yazmalar her zaman ağa gider
  if (url.origin !== self.location.origin) return;         // Supabase/Anthropic vb. dokunulmaz
  if (url.pathname.startsWith('/api/')) return;            // API her zaman ağdan

  // Uygulamanın kendisi: ÖNCE AĞ, başarısızsa önbellek (network-first)
  if (APP.indexOf(url.pathname) !== -1) {
    e.respondWith(
      fetch(e.request)
        .then((resp) => {
          if (resp && resp.ok) {
            const copy = resp.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
          }
          return resp;
        })
        .catch(() => caches.match(e.request).then((r) => r || Response.error()))
    );
    return;
  }

  // Değişmeyen statik dosyalar: önce önbellek, arkada tazele
  if (STATIC.indexOf(url.pathname) !== -1) {
    e.respondWith(
      caches.match(e.request).then((r) => {
        const net = fetch(e.request)
          .then((resp) => {
            if (resp && resp.ok) caches.open(CACHE).then((c) => c.put(e.request, resp.clone())).catch(() => {});
            return resp;
          })
          .catch(() => r);
        return r || net;
      })
    );
  }
});
