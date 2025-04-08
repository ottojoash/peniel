// This is a minimal service worker that does nothing
// It's here to prevent 404 errors in the browser console

self.addEventListener("install", (event) => {
    self.skipWaiting()
  })
  
  self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim())
  })
  
  self.addEventListener("fetch", (event) => {
    // Let the browser handle the request normally
    event.respondWith(fetch(event.request))
  })
  
  