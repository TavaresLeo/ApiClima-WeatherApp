import { API_KEY } from '../utils/constants.js';

export const getWeatherData = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=pt_br`;
    const res = await fetch(url);
    return await res.json();
};

export const getForecastData = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}&lang=pt_br`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
};

export const getWeatherDataByCoords = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=pt_br`;
    const res = await fetch(url);
    return await res.json();
};