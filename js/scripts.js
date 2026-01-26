// --- VARIÁVEIS E SELEÇÃO DE ELEMENTOS ---
const apiKey = "544174bd2bfe8116425360c0dbda71cb";
// OBS: Substitua pela sua chave REAL do Unsplash. Se não tiver, o código usa fallback.
const unsplashAccessKey = "XDUu1swRaDcGJ7LEyQOjLwz7HcBMHXXtUS_0H2q9jgo"; 

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");
const locationBtn = document.querySelector("#location");

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
        // Se a chave for padrão ou vazia, usa gradiente padrão para não dar erro 401
        if (unsplashAccessKey === "SUA_CHAVE_AQUI" || unsplashAccessKey === "") {
             console.warn("Sem chave Unsplash. Usando imagem padrão.");
             document.body.style.backgroundImage = `linear-gradient(180deg, #594cee 0%, #8dd0f5 100%)`; 
             return;
        }

        const url = `https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashAccessKey}&orientation=landscape&per_page=1`;
        
        const res = await fetch(url);
        
        if (!res.ok) throw new Error("Erro API Imagem");

        const data = await res.json();

        if (data.results && data.results.length > 0) {
            const imageUrl = data.results[0].urls.regular;
            document.body.style.backgroundImage = `url("${imageUrl}")`;
        } else {
            document.body.style.backgroundImage = `linear-gradient(180deg, #594cee 0%, #8dd0f5 100%)`;
        }
    } catch (error) {
        console.error("Erro imagem:", error);
        document.body.style.backgroundImage = `linear-gradient(180deg, #594cee 0%, #8dd0f5 100%)`;
    }
};

const getForecastData = async (city) => {
    const apiForecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;
    const res = await fetch(apiForecastURL);
    if (!res.ok) return null;
    return await res.json();
};

const showForecast = async (city) => {
    const data = await getForecastData(city);
    
    if (!data || !data.list) return;

    forecastList.innerHTML = "";
    
    // Filtra previsões do meio-dia
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

  const data = await getWeatherData(city);

  if (data.cod === "404" || data.cod === "400") {
    if(errorMessageContainer) errorMessageContainer.classList.remove("hide");
    return;
  }

  // Preenchimento dos dados
  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;
  weatherIconElement.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
  countryElement.setAttribute("src", `https://flagcdn.com/64x48/${data.sys.country.toLowerCase()}.png`);
  humidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}km/h`;
  
  // Máxima e Mínima
  maxTempElement.innerText = parseInt(data.main.temp_max);
  minTempElement.innerText = parseInt(data.main.temp_min);

  // Background e Previsão
  updateBackgroundImage(data.name);
  showForecast(city);

  // Reseta visual da previsão (fechado)
  forecastContainer.classList.add("hide");

  // Mostra o quadro
  weatherContainer.classList.remove("hide");
  container.classList.add("result-mode");
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
        navigator.geolocation.getCurrentPosition(async (position) => {
            toggleLoader();
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Busca direta por coordenadas para obter o nome da cidade correto
            const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=pt_br`;
            
            try {
                const res = await fetch(apiURL);
                const data = await res.json();
                toggleLoader();
                
                if(data.name) {
                    showWeatherData(data.name);
                }
            } catch (error) {
                console.error(error);
                toggleLoader();
            }
        });
    } else {
        alert("Geolocalização não suportada.");
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
    document.body.style.backgroundImage = `linear-gradient(180deg, #594cee 0%, #8dd0f5 100%)`;
});