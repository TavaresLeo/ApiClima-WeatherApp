import { ELEMENTS } from './utils/constants.js';
import { getWeatherData, getForecastData, getWeatherDataByCoords } from './api/weather.api.js';
import { updateUI } from './ui/weather.ui.js';
import { setupVoiceSearch } from './services/speech.service.js';
import { getUserPosition } from './services/geolocation.service.js';

// Utilitário interno para controle de tela
const toggleLoader = (show) => {
    const loader = document.getElementById('loader');
    if (show) loader.classList.remove('hide');
    else loader.classList.add('hide');
};

const hideErrors = () => {
    document.getElementById('error-message').classList.add('hide');
};

// Função Principal de Orquestração
const showWeatherData = async (city) => {
    try {
        toggleLoader(true);
        hideErrors();
        ELEMENTS.weatherContainer.classList.add('hide');

        const data = await getWeatherData(city);
        
        // Se a API retornar código de erro (ex: 404 Cidade não encontrada)
        if (data.cod && data.cod !== 200) {
            throw new Error("Cidade não encontrada");
        }

        const forecastData = await getForecastData(city);
        updateUI(data, forecastData);
    } catch (error) {
        console.error("Erro na busca de dados:", error);
        document.getElementById('error-message').classList.remove('hide');
    } finally {git 
        toggleLoader(false);
    }
};

// Eventos de Busca
const handleSearch = () => {
    const city = ELEMENTS.cityInput.value.trim();
    if (city) showWeatherData(city);
};

// Trocamos "click" por "pointerdown"
ELEMENTS.searchBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    handleSearch();
    
    // Opcional: Força o teclado do celular a fechar após a busca
    ELEMENTS.cityInput.blur(); 
});

ELEMENTS.cityInput.addEventListener("keyup", (e) => {
    if (e.code === "Enter") handleSearch();
});

// Evento de Geolocalização (Refatorado usando Promises)
ELEMENTS.locationBtn.addEventListener("click", async () => {
    try {
        toggleLoader(true);
        hideErrors();
        
        const coords = await getUserPosition();
        const data = await getWeatherDataByCoords(coords.latitude, coords.longitude);
        
        if (data.name) {
            const forecastData = await getForecastData(data.name);
            updateUI(data, forecastData);
        }
    } catch (error) {
        console.error("Erro ao buscar localização do usuário:", error);
        alert("Não foi possível obter sua localização. Verifique as permissões do navegador.");
    } finally {
        toggleLoader(false);
    }
});

// Controles de UI
ELEMENTS.forecastBtn.addEventListener("click", () => {
    ELEMENTS.forecastContainer.classList.toggle("hide");
});

ELEMENTS.closeBtn.addEventListener("click", () => {
    ELEMENTS.cityInput.value = "";
    ELEMENTS.weatherContainer.classList.add("hide");
    ELEMENTS.container.classList.remove("result-mode");
    hideErrors();
    document.body.style.backgroundImage = `linear-gradient(180deg, #385980 0%, #255964 100%)`;
});

// Correções de teclado para Mobile
ELEMENTS.cityInput.addEventListener("focus", () => document.body.classList.add("keyboard-active"));
ELEMENTS.cityInput.addEventListener("blur", () => document.body.classList.remove("keyboard-active"));

// Inicialização de Serviços Extras
setupVoiceSearch(showWeatherData);