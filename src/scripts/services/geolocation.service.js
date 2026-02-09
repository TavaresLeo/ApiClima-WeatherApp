import { ELEMENTS } from '../utils/constants.js';
import { getWeatherDataByCoords } from '../api/weather.api.js';
import { updateUI } from '../ui/weather.ui.js'; // Precisamos mover a lógica principal para cá ou importar

export const handleLocationSearch = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const data = await getWeatherDataByCoords(latitude, longitude);
                if(data.name) {
                     // Aqui precisamos chamar a função principal que orquestra tudo.
                     // Para simplificar, vamos disparar um evento customizado ou importar showWeatherData
                     // Como showWeatherData está no main, vamos exportar e usar callback
                     return data; 
                }
            } catch (error) {
                console.error(error);
                alert("Erro ao buscar localização.");
            }
        }, () => alert("Erro ao obter localização"), { enableHighAccuracy: true });
    } else {
        alert("Geolocalização não suportada.");
    }
};