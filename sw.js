const C = 'zdld-3';
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'index.html', 'manifest.json', 'logo-gold.png', 'logo-white.png', 'icon-192.png']))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const k = r.clone(); caches.open(C).then(c => c.put(e.request, k)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
