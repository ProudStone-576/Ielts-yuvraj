/*
 * Service worker: makes the app installable and quicker on a weak connection.
 * - Recordings, maps, icons and built scripts never change once published, so they are served from the cache.
 * - Pages and API calls always go to the network first (so progress and new content are never stale);
 *   if the network is down, the last cached copy of a page is shown instead.
 */
const CACHE = "ielts-coach-v1";
const STATIC = /^\/(audio|maps|icons|_next\/static)\//;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  // Audio is fetched in ranges by the player; let the browser handle those directly.
  if (req.headers.has("range")) return;

  if (STATIC.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok && res.status === 200) cache.put(req, res.clone());
        return res;
      }),
    );
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone(); // copy before the browser reads the body
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(async () => (await caches.match(req)) ?? (await caches.match("/")) ?? Response.error()),
    );
  }
});
