const CACHE="duri-bus-v17";
const FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
// 네트워크 우선 + 브라우저 HTTP 캐시 건너뛰기: 열 때마다 최신 버전 확인, 오프라인이면 저장본 사용
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  const req=e.request.mode==="navigate"||/\.(html|js|webmanifest)$/.test(new URL(e.request.url).pathname)?new Request(e.request,{cache:"no-cache"}):e.request;
  e.respondWith(fetch(req).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
});
