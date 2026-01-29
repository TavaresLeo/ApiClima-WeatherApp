// --- VARIÁVEIS E SELEÇÃO DE ELEMENTOS ---
const apiKey = "544174bd2bfe8116425360c0dbda71cb";
const unsplashAccessKey = "XDUu1swRaDcGJ7LEyQOjLwz7HcBMHXXtUS_0H2q9jgo"; 

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");
const locationBtn = document.querySelector("#location");
const micBtn = document.querySelector("#mic-btn");

// Elementos do Clima
const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const humidityElement = document.querySelector("#humidity span");
const windElement = document.querySelector("#wind span");

// Máxima e Mínima
const maxTempElement = document.querySelector("#max-temp");
const minTempElement = document.querySelector("#min-temp");

// Containers e Controle
const weatherContainer = document.querySelector("#weather-data");
const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");
const container = document.querySelector(".container");
const closeBtn = document.querySelector("#close-btn");

// Previsão
const forecastBtn = document.querySelector("#forecast-btn");
const forecastContainer = document.querySelector("#forecast-container");
const forecastList = document.querySelector("#forecast-list");


// --- FUNÇÕES ---

const toggleLoader = () => {
    if(loader) loader.classList.toggle("hide");
};

const updateBackgroundImage = async (city) => {
    try {
        // Fallback se a chave for inválida ou vazia
        if (!unsplashAccessKey || unsplashAccessKey === "") {
             document.body.style.backgroundImage = `linear-gradient(180deg, #594cee 0%, #8dd0f5 100%)`; 
             return;
        }

        // Tenta buscar imagem de céu/cidade
        const url = `https://api.unsplash.com/search/photos?query=${city} sky&client_id=${unsplashAccessKey}&orientation=portrait&per_page=1`;
        
        const res = await fetch(url);
        
        if (!res.ok) throw new Error("Erro API Imagem");

        const data = await res.json();

        if (data.results && data.results.length > 0) {
            const imageUrl = data.results[0].urls.regular;
            document.body.style.backgroundImage = `url("${imageUrl}")`;
        } else {
            // Gradiente padrão se não achar foto
            document.body.style.backgroundImage = `linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)`;
        }
    } catch (error) {
        console.error("Erro imagem:", error);
        document.body.style.backgroundImage = `linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)`;
    }
};

const getForecastData = async (city) => {
    const apiForecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;
    const res = await fetch(apiForecastURL);
    if (!res.ok) return null;
    return await res.json();
};

// Função para calcular Máx/Mín real do dia baseada na previsão
const calculateDayMinMax = (forecastList) => {
    // Pega as próximas 8 previsões (24 horas / 3h = 8 blocos)
    const todayForecasts = forecastList.slice(0, 8);
    
    const minTemps = todayForecasts.map(item => item.main.temp_min);
    const maxTemps = todayForecasts.map(item => item.main.temp_max);
    
    return { min: Math.min(...minTemps), max: Math.max(...maxTemps) };
};

// Renderiza os cards da previsão visual
const renderForecastVisuals = (data) => {
    forecastList.innerHTML = "";
    
    // Filtra previsões (ex: pega as de meio-dia)
    const dailyForecast = data.list.filter((forecast) => 
        forecast.dt_txt.includes("12:00:00")
    );

    dailyForecast.forEach((day) => {
        const date = new Date(day.dt * 1000).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
        });

        const forecastElement = document.createElement("div");
        forecastElement.classList.add("forecast-card");
        forecastElement.innerHTML = `
            <p class="forecast-date">${date}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Ícone" />
            <p class="forecast-temp">${parseInt(day.main.temp)}&deg;C</p>
        `;
        forecastList.appendChild(forecastElement);
    });
};

const getWeatherData = async (city) => {
  toggleLoader();
  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;
  
  const res = await fetch(apiWeatherURL);
  const data = await res.json();
  
  toggleLoader();
  return data;
};

const showWeatherData = async (city) => {
  errorMessageContainer.classList.add("hide");

  // 1. Pega os dados atuais
  const data = await getWeatherData(city);

  if (data.cod === "404" || data.cod === "400") {
    if(errorMessageContainer) errorMessageContainer.classList.remove("hide");
    return;
  }

  // 2. Pega dados da previsão para calcular min/max real
  const forecastData = await getForecastData(city);

  // Preenchimento dos dados principais
  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;
  weatherIconElement.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
  countryElement.setAttribute("src", `https://flagcdn.com/64x48/${data.sys.country.toLowerCase()}.png`);
  humidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}km/h`;
  
  // Lógica de Máxima e Mínima
  if (forecastData && forecastData.list) {
    const realTemps = calculateDayMinMax(forecastData.list); // Note: .list (minúsculo)
    maxTempElement.innerText = parseInt(realTemps.max);
    minTempElement.innerText = parseInt(realTemps.min);
    
    // Renderiza a previsão visualmente
    renderForecastVisuals(forecastData);
  } else {
    // Fallback se a previsão falhar
    maxTempElement.innerText = parseInt(data.main.temp_max);
    minTempElement.innerText = parseInt(data.main.temp_min);
  }

  updateBackgroundImage(data.name);

  // Reseta visual da previsão (fechado)
  forecastContainer.classList.add("hide");

  // Mostra o quadro de clima e ajusta o container
  weatherContainer.classList.remove("hide");
  container.classList.add("result-mode");
  
  // Fecha o teclado mobile
  cityInput.blur();
};

// --- FUNÇÃO DE PESQUISA POR VOZ ---
const setupVoiceSearch = () => {
    // Verifica suporte do navegador
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'pt-BR';
        recognition.continuous = false;

        micBtn.addEventListener('click', () => {
            if (micBtn.classList.contains('listening')) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });

        recognition.onstart = () => {
            micBtn.classList.add('listening');
            cityInput.placeholder = "Ouvindo...";
        };

        recognition.onend = () => {
            micBtn.classList.remove('listening');
            cityInput.placeholder = "Digite o nome da cidade";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            cityInput.value = transcript;
            showWeatherData(transcript);
        };
    } else {
        // Se não suportar, esconde o botão
        micBtn.style.display = 'none';
        console.log("Navegador sem suporte a voz");
    }
};

// --- EVENTOS ---

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const city = cityInput.value;
  if(city) showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value;
    if(city) showWeatherData(city);
  }
});

// Botão de Geolocalização
locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
            toggleLoader(); 
            
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=pt_br`;
            
                try {
                    const res = await fetch(apiURL);
                    const data = await res.json();
                    
                    if(data.name) {
                        showWeatherData(data.name);
                    } else {
                        toggleLoader();
                        alert("Cidade não localizada.");
                    }
                } catch (error) {
                    console.error(error);
                    toggleLoader();
                }
            },
        (error) => {
            toggleLoader();
            console.error("Erro GPS:", error);
            alert("Não foi possível pegar sua localização. Verifique se o GPS está ativo.")
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    } else {
        alert("Geolocalização não suportada pelo seu navegador.")
    }  
});

// Botão Expandir Previsão
forecastBtn.addEventListener("click", () => {
    forecastContainer.classList.toggle("hide");
});

// Botão Fechar (X)
closeBtn.addEventListener("click", () => {
    cityInput.value = "";
    weatherContainer.classList.add("hide");
    container.classList.remove("result-mode");
    errorMessageContainer.classList.add("hide");
    // Reseta fundo
    document.body.style.backgroundImage = `linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)`;
});

// --- CONTROLE DO TECLADO MOBILE ---
cityInput.addEventListener("focus", () => {
    document.body.classList.add("keyboard-active");
});

cityInput.addEventListener("blur", () => {
    document.body.classList.remove("keyboard-active");
});

// Inicializa a Voz
setupVoiceSearch();