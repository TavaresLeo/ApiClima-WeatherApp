// sw.js (Na raiz do projeto)

const CACHE_NAME = "apiclima-v1"; // Mude o nome p/ v2 quando atualizar o código
const ASSETS_TO_CACHE = [
  "./",                 // Raiz
  "./index.html",       // HTML Principal
  "./manifest.json",    // Manifesto
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
  "./src/scripts/ui/weather.ui.js",
  // Adicione aqui outros arquivos que seu app usa
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css",
  "https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap"
];

// 1. Instalação: Baixa e salva os arquivos no cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Força o SW a ativar imediatamente
});

// 2. Ativação: Limpa caches antigos
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
  self.clients.claim(); // Controla a página imediatamente
});

// 3. Interceptação (Fetch): Estratégia "Stale-while-revalidate"
self.addEventListener("fetch", (event) => {
  // Não cachear chamadas para APIs externas (Weather/Unsplash) para ter dados frescos
  if (event.request.url.includes("api.openweathermap.org") || 
      event.request.url.includes("api.unsplash.com")) {
     // Para APIs: Tenta Rede primeiro, se falhar, tenta cache (opcional, aqui deixamos rede pura)
     return; 
  }

  // Para arquivos do App (HTML, CSS, JS): Cache First, depois Rede
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se achou no cache, retorna. Senão, busca na rede.
      return response || fetch(event.request);
    })
  );
});