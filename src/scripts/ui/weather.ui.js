import { ELEMENTS } from '../utils/constants.js';
import { updateBackgroundImage } from '../api/unsplash.api.js';

const calculateDayMinMax = (forecastList) => {
    const todayForecasts = forecastList.slice(0, 8);
    const minTemps = todayForecasts.map(item => item.main.temp_min);
    const maxTemps = todayForecasts.map(item => item.main.temp_max);
    return { min: Math.min(...minTemps), max: Math.max(...maxTemps) };
};

const renderForecastVisuals = (data) => {
    ELEMENTS.forecastList.innerHTML = "";
    const dailyForecast = data.list.filter((forecast) => forecast.dt_txt.includes("12:00:00"));

    dailyForecast.forEach((day) => {
        const date = new Date(day.dt * 1000).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        const div = document.createElement("div");
        div.classList.add("forecast-card");
        div.innerHTML = `
            <p>${date}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
            <p>${parseInt(day.main.temp)}°</p>
        `;
        ELEMENTS.forecastList.appendChild(div);
    });
};

export const updateUI = (data, forecastData) => {
    if (data.cod === "404" || data.cod === "400") {
        if(ELEMENTS.errorMessageContainer) ELEMENTS.errorMessageContainer.classList.remove("hide");
        return;
    }

    ELEMENTS.errorMessageContainer.classList.add("hide");

    // Dados Principais
    ELEMENTS.cityElement.innerText = data.name;
    ELEMENTS.tempElement.innerText = parseInt(data.main.temp);
    ELEMENTS.descElement.innerText = data.weather[0].description;
    ELEMENTS.countryElement.setAttribute("src", `https://flagcdn.com/64x48/${data.sys.country.toLowerCase()}.png`);
    ELEMENTS.humidityElement.innerText = `${data.main.humidity}%`;
    ELEMENTS.windElement.innerText = `${data.wind.speed}km/h`;

    // Min/Max e Previsão
    if (forecastData && forecastData.list) {
        const realTemps = calculateDayMinMax(forecastData.list);
        ELEMENTS.maxTempElement.innerText = parseInt(realTemps.max);
        ELEMENTS.minTempElement.innerText = parseInt(realTemps.min);
        renderForecastVisuals(forecastData);
    } else {
        ELEMENTS.maxTempElement.innerText = parseInt(data.main.temp_max);
        ELEMENTS.minTempElement.innerText = parseInt(data.main.temp_min);
    }

    updateBackgroundImage(data.name);

    ELEMENTS.forecastContainer.classList.add("hide");
    ELEMENTS.weatherContainer.classList.remove("hide");
    ELEMENTS.container.classList.add("result-mode");
    
    // Fecha teclado
    ELEMENTS.cityInput.blur();
};