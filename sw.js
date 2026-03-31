// sw.js (Na raiz do projeto)

const CACHE_NAME = "apiclima-v2"; // Atualizado para v2 para forçar o navegador a limpar o antigo
const ASSETS_TO_CACHE = [
  "./",                 
  "./index.html",       
  "./manifest.json",    
  "./src/styles/main.css",
  "./src/styles/base.css",
  "./src/styles/layout.css",
  "./src/styles/components.css",
  "./src/scripts/main.js",
  "./src/scripts/utils/constants.js",
  "./src/scripts/utils/config.js",
  "./src/scripts/api/weather.api.js",
  "./src/scripts/api/unsplash.api.js",
  "./src/scripts/services/speech.service.js",
  "./src/scripts/services/geolocation.service.js", // <-- Adicionado o novo serviço
  "./src/scripts/ui/weather.ui.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css",
  "https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap"
];

// 1. Instalação: Baixa e salva os arquivos no cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Fazendo cache dos arquivos");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Ativação: Limpa caches antigos (ex: apiclima-v1)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removendo cache antigo", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Interceptação (Fetch): Estratégia "Network First" (Rede Primeiro)
self.addEventListener("fetch", (event) => {
  // Ignora chamadas de API (sempre busca da rede para ter dados frescos)
  if (event.request.url.includes("api.openweathermap.org") || 
      event.request.url.includes("api.unsplash.com")) {
     return; 
  }

  // Network First: Tenta a rede; se falhar (offline), busca no cache.
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});