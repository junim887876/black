// sw.js - Compatível com OneSignal v16 + PWA Off-line
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

const CACHE_NAME = 'black-v3';

// Instalação do Service Worker
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

// Ativação e Limpeza de Caches Antigos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de Requisições
self.addEventListener('fetch', (e) => {
  // Ignora chamadas da API/SDK do OneSignal para evitar cache indevido de notificações
  if (e.request.url.includes('onesignal.com') || e.request.url.includes('onesignal')) {
    return;
  }

  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
