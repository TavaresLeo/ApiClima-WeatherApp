/**
 * Solicita a posição do usuário ao navegador de forma assíncrona.
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getUserPosition = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocalização não suportada pelo navegador."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                reject(error);
            },
            { enableHighAccuracy: true }
        );
    });
};