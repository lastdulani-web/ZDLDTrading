const C = 'zdld-1';
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'index.html', 'logo.png']))));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const k = r.clone(); caches.open(C).then(c => c.put(e.request, k)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
