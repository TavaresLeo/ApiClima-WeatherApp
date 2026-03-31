import { Config } from '../utils/config.js';

export const updateBackgroundImage = async (city) => {
    try {
        if (!Config.UNSPLASH_KEY) {
             document.body.style.backgroundImage = `url("${Config.FALLBACK_IMG}")`;
             return;
        }

        const url = `https://api.unsplash.com/search/photos?query=${city} nature sky&client_id=${Config.UNSPLASH_KEY}&orientation=portrait&per_page=1`;
        const res = await fetch(url);
        
        if (res.status === 403) throw new Error("Limite Excedido");
        if (!res.ok) throw new Error("Erro API Imagem");

        const data = await res.json();

        if (data.results && data.results.length > 0) {
            document.body.style.backgroundImage = `url("${data.results[0].urls.regular}")`;
        } else {
            document.body.style.backgroundImage = `url("${Config.FALLBACK_IMG}")`;
        }
        document.body.style.backgroundSize = "cover"; 

    } catch (error) {
        console.error("Erro imagem:", error);
        document.body.style.backgroundImage = `url("${Config.FALLBACK_IMG}")`;
        document.body.style.backgroundSize = "cover";
    }
};