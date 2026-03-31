// =============================================================
//  app.js — ApiClima
//  Correções aplicadas:
//  [SEGURANÇA] Chaves de API removidas do client-side.
//              As requisições agora passam pelos proxies em /api/
//  [DUPLICAÇÃO] Função centralizada `apiFetch()` para todas
//              as chamadas HTTP, eliminando repetição de params.
//              Tratamento de erro unificado em `showError()`.
// =============================================================


// --- SELEÇÃO DE ELEMENTOS ---
const cityInput              = document.querySelector("#city-input");
const searchBtn              = document.querySelector("#search");
const locationBtn            = document.querySelector("#location");
const micBtn                 = document.querySelector("#mic-btn");

const cityElement            = document.querySelector("#city");
const tempElement            = document.querySelector("#temperature span");
const descElement            = document.querySelector("#description");
const weatherIconElement     = document.querySelector("#weather-icon");
const countryElement         = document.querySelector("#country");
const humidityElement        = document.querySelector("#humidity span");
const windElement            = document.querySelector("#wind span");
const maxTempElement         = document.querySelector("#max-temp");
const minTempElement         = document.querySelector("#min-temp");

const weatherContainer       = document.querySelector("#weather-data");
const errorMessageContainer  = document.querySelector("#error-message");
const loader                 = document.querySelector("#loader");
const container              = document.querySelector(".container");
const closeBtn               = document.querySelector("#close-btn");

const forecastBtn            = document.querySelector("#forecast-btn");
const forecastContainer      = document.querySelector("#forecast-container");
const forecastList           = document.querySelector("#forecast-list");

const FALLBACK_BG = "https://i.gifer.com/7QVp.gif";


// --- UTILITÁRIOS ---

const toggleLoader = () => loader?.classList.toggle("hide");

// [FIX DUPLICAÇÃO] Ponto único para exibir erros — antes estava
// espalhado em if/else por várias funções.
const showError = (msg = "") => {
    if (!errorMessageContainer) return;
    if (msg) errorMessageContainer.querySelector("p")?.innerText = msg;
    errorMessageContainer.classList.remove("hide");
};

// [FIX DUPLICAÇÃO] Todas as chamadas à OpenWeatherMap passam
// por aqui. O proxy /api/weather repassa para a OWM já com
// a chave segura armazenada em variável de ambiente no servidor.
//
// Antes havia 3 blocos fetch separados com parâmetros repetidos:
//   fetch(`...weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`)
//   fetch(`...forecast?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`)
//   fetch(`...weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=pt_br`)
const apiFetch = (endpoint, params = {}) => {
    const query = new URLSearchParams(params).toString();
    // /api/weather e /api/forecast são as Vercel Edge Functions (ver pasta /api/)
    return fetch(`/api/${endpoint}?${query}`).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    });
};


// --- FUNÇÕES DE CLIMA ---

const getWeatherByCity = (city) =>
    apiFetch("weather", { q: city });

const getWeatherByCoords = (lat, lon) =>
    apiFetch("weather", { lat, lon });

const getForecastByCity = (city) =>
    apiFetch("forecast", { q: city });

const calculateDayMinMax = (list) => {
    const slice = list.slice(0, 8);
    return {
        min: Math.min(...slice.map((i) => i.main.temp_min)),
        max: Math.max(...slice.map((i) => i.main.temp_max)),
    };
};

const renderForecastVisuals = (data) => {
    forecastList.innerHTML = "";
    data.list
        .filter((f) => f.dt_txt.includes("12:00:00"))
        .forEach((day) => {
            const date = new Date(day.dt * 1000).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
            });
            const card = document.createElement("div");
            card.classList.add("forecast-card");
            card.innerHTML = `
                <p class="forecast-date">${date}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png"
                     alt="${day.weather[0].description}" />
                <p class="forecast-temp">${parseInt(day.main.temp)}&deg;C</p>
            `;
            forecastList.appendChild(card);
        });
};


// --- FUNÇÃO DE FUNDO ---

// [FIX SEGURANÇA] A chave Unsplash foi removida do client-side.
// A requisição agora passa pelo proxy /api/background que a mantém
// segura no servidor.
const updateBackgroundImage = async (city) => {
    try {
        const res = await fetch(`/api/background?city=${encodeURIComponent(city)}`);
        if (!res.ok) throw new Error("Proxy de imagem falhou");
        const { url } = await res.json();
        document.body.style.backgroundImage = `url("${url || FALLBACK_BG}")`;
    } catch {
        document.body.style.backgroundImage = `url("${FALLBACK_BG}")`;
    } finally {
        document.body.style.backgroundSize = "cover";
    }
};


// --- RENDERIZAÇÃO PRINCIPAL ---

const showWeatherData = async (city) => {
    errorMessageContainer.classList.add("hide");
    toggleLoader();

    try {
        // [FIX DUPLICAÇÃO] Antes getWeatherData e getForecastData
        // faziam fetches independentes com parâmetros repetidos.
        // Agora ambos usam apiFetch() e rodam em paralelo.
        const [data, forecastData] = await Promise.all([
            getWeatherByCity(city),
            getForecastByCity(city),
        ]);

        if (data.cod === "404" || data.cod === "400") {
            showError();
            return;
        }

        cityElement.innerText        = data.name;
        tempElement.innerText        = parseInt(data.main.temp);
        descElement.innerText        = data.weather[0].description;
        weatherIconElement.setAttribute(
            "src",
            `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
        );
        weatherIconElement.setAttribute("alt", data.weather[0].description);
        countryElement.setAttribute(
            "src",
            `https://flagcdn.com/64x48/${data.sys.country.toLowerCase()}.png`
        );
        countryElement.setAttribute("alt", `Bandeira ${data.sys.country}`);
        humidityElement.innerText = `${data.main.humidity}%`;
        windElement.innerText     = `${data.wind.speed}km/h`;

        if (forecastData?.list) {
            const { min, max } = calculateDayMinMax(forecastData.list);
            maxTempElement.innerText = parseInt(max);
            minTempElement.innerText = parseInt(min);
            renderForecastVisuals(forecastData);
        } else {
            maxTempElement.innerText = parseInt(data.main.temp_max);
            minTempElement.innerText = parseInt(data.main.temp_min);
        }

        updateBackgroundImage(data.name);
        forecastContainer.classList.add("hide");
        weatherContainer.classList.remove("hide");
        container.classList.add("result-mode");
        cityInput.blur();

    } catch (err) {
        console.error("Erro ao buscar clima:", err);
        showError("Não foi possível carregar os dados. Tente novamente.");
    } finally {
        toggleLoader();
    }
};


// --- VOZ ---

const setupVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
        micBtn.style.display = "none";
        return;
    }
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = false;

    micBtn.addEventListener("click", () => {
        recognition.classList?.contains("listening")
            ? recognition.stop()
            : recognition.start();
    });

    recognition.onstart = () => {
        micBtn.classList.add("listening");
        cityInput.placeholder = "Ouvindo...";
    };
    recognition.onend = () => {
        micBtn.classList.remove("listening");
        cityInput.placeholder = "Digite o nome da cidade";
    };
    recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        cityInput.value = transcript;
        showWeatherData(transcript);
    };
};


// --- EVENTOS ---

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
        const city = e.target.value.trim();
        if (city) showWeatherData(city);
    }
});

locationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolocalização não suportada pelo seu navegador.");
        return;
    }
    toggleLoader();
    navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude: lat, longitude: lon } }) => {
            try {
                const data = await getWeatherByCoords(lat, lon);
                if (data.name) {
                    showWeatherData(data.name);
                } else {
                    toggleLoader();
                    alert("Cidade não localizada.");
                }
            } catch (err) {
                console.error(err);
                toggleLoader();
                showError("Erro ao obter clima pela localização.");
            }
        },
        (err) => {
            toggleLoader();
            console.error("Erro GPS:", err);
            alert("Não foi possível pegar sua localização. Verifique se o GPS está ativo.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
});

forecastBtn.addEventListener("click", () => {
    forecastContainer.classList.toggle("hide");
});

closeBtn.addEventListener("click", () => {
    cityInput.value = "";
    weatherContainer.classList.add("hide");
    container.classList.remove("result-mode");
    errorMessageContainer.classList.add("hide");
    document.body.style.backgroundImage =
        "linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)";
});

cityInput.addEventListener("focus", () =>
    document.body.classList.add("keyboard-active")
);
cityInput.addEventListener("blur", () =>
    document.body.classList.remove("keyboard-active")
);

setupVoiceSearch();