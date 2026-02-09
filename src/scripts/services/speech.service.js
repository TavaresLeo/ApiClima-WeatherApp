import { ELEMENTS } from '../utils/constants.js';

export const setupVoiceSearch = (callbackSearch) => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'pt-BR';
        recognition.continuous = false;

        ELEMENTS.micBtn.addEventListener('click', () => {
            if (ELEMENTS.micBtn.classList.contains('listening')) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });

        recognition.onstart = () => {
            ELEMENTS.micBtn.classList.add('listening');
            ELEMENTS.cityInput.placeholder = "Ouvindo...";
        };

        recognition.onend = () => {
            ELEMENTS.micBtn.classList.remove('listening');
            ELEMENTS.cityInput.placeholder = "Digite o nome da cidade";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            ELEMENTS.cityInput.value = transcript;
            callbackSearch(transcript); // Chama a função de busca
        };
    } else {
        ELEMENTS.micBtn.style.display = 'none';
    }
};