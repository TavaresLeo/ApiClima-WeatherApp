// src/scripts/utils/constants.js
import { Config } from './config.js';

export const API_KEY = Config.API_KEY;
export const UNSPLASH_KEY = Config.UNSPLASH_KEY;
// ... resto do seu arquivo constants.js continua igual ...

export const ELEMENTS = {
    cityInput: document.querySelector("#city-input"),
    searchBtn: document.querySelector("#search"),
    locationBtn: document.querySelector("#location"),
    micBtn: document.querySelector("#mic-btn"),
    cityElement: document.querySelector("#city"),
    tempElement: document.querySelector("#temperature span"),
    descElement: document.querySelector("#description"),
    countryElement: document.querySelector("#country"),
    humidityElement: document.querySelector("#humidity span"),
    windElement: document.querySelector("#wind span"),
    maxTempElement: document.querySelector("#max-temp"),
    minTempElement: document.querySelector("#min-temp"),
    weatherContainer: document.querySelector("#weather-data"),
    errorMessageContainer: document.querySelector("#error-message"),
    loader: document.querySelector("#loader"),
    container: document.querySelector(".container"),
    closeBtn: document.querySelector("#close-btn"),
    forecastBtn: document.querySelector("#forecast-btn"),
    forecastContainer: document.querySelector("#forecast-container"),
    forecastList: document.querySelector("#forecast-list")
};