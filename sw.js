const CACHE = 'lumio-v2';
const SHELL = ['./','./index.html','./manifest.json','./sw.js','./icon-192.png','./icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(()=>{})));
  self.skipWaiting();
});
self.addEventListener('activate', e => { e.waitUntil(clients.claim()); });
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(r => {
      if(r && r.ok){ const rc=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,rc)); }
      return r;
    }).catch(() => cached || new Response('Sin conexión',{status:503})))
  );
});
