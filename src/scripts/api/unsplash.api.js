import { UNSPLASH_KEY } from '../utils/constants.js';

export const updateBackgroundImage = async (city) => {
    try {
        const fallbackGif = "https://i.gifer.com/7QVp.gif"; 

        if (!UNSPLASH_KEY) {
             document.body.style.backgroundImage = `url("${fallbackGif}")`;
             return;
        }

        const url = `https://api.unsplash.com/search/photos?query=${city} nature sky&client_id=${UNSPLASH_KEY}&orientation=portrait&per_page=1`;
        const res = await fetch(url);
        
        if (res.status === 403) throw new Error("Limite Excedido");
        if (!res.ok) throw new Error("Erro API Imagem");

        const data = await res.json();

        if (data.results && data.results.length > 0) {
            document.body.style.backgroundImage = `url("${data.results[0].urls.regular}")`;
        } else {
            document.body.style.backgroundImage = `url("${fallbackGif}")`;
        }
        document.body.style.backgroundSize = "cover"; 

    } catch (error) {
        console.error("Erro imagem:", error);
        document.body.style.backgroundImage = `url("https://i.gifer.com/7QVp.gif")`;
        document.body.style.backgroundSize = "cover";
    }
};