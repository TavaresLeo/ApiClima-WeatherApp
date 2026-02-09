import { ELEMENTS } from './utils/constants.js';
import { getWeatherData, getForecastData, getWeatherDataByCoords } from './api/weather.api.js';
import { updateUI } from './ui/weather.ui.js';
import { setupVoiceSearch } from './services/speech.service.js';

// Função Principal
const showWeatherData = async (city) => {
    const data = await getWeatherData(city);
    const forecastData = await getForecastData(city);
    updateUI(data, forecastData);
};

// Eventos
ELEMENTS.searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (ELEMENTS.cityInput.value) showWeatherData(ELEMENTS.cityInput.value);
});

ELEMENTS.cityInput.addEventListener("keyup", (e) => {
    if (e.code === "Enter" && ELEMENTS.cityInput.value) showWeatherData(ELEMENTS.cityInput.value);
});

// Geolocalização
ELEMENTS.locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const data = await getWeatherDataByCoords(latitude, longitude);
                if(data.name) {
                    const forecastData = await getForecastData(data.name);
                    updateUI(data, forecastData);
                }
            } catch (e) { console.error(e); }
        });
    }
});

// UI Controls
ELEMENTS.forecastBtn.addEventListener("click", () => ELEMENTS.forecastContainer.classList.toggle("hide"));
ELEMENTS.closeBtn.addEventListener("click", () => {
    ELEMENTS.cityInput.value = "";
    ELEMENTS.weatherContainer.classList.add("hide");
    ELEMENTS.container.classList.remove("result-mode");
    document.body.style.backgroundImage = `linear-gradient(180deg, #385980 0%, #255964 100%)`;
});

// Teclado Mobile
ELEMENTS.cityInput.addEventListener("focus", () => document.body.classList.add("keyboard-active"));
ELEMENTS.cityInput.addEventListener("blur", () => document.body.classList.remove("keyboard-active"));

// Iniciar Voz
setupVoiceSearch(showWeatherData);