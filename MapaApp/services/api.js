
const API_IP = '192.168.100.67';

// URLs base de los servicios
export const API_URL = `http://${API_IP}:3000`; // Backend 
export const MARTIN_URL = `http://${API_IP}:3111`; // Martin Tiles

export const fetchAPI = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
        // Headers por defecto (enviamos y recibimos JSON)
        headers: {
            'Content-Type': 'application/json',
            ...options.headers, // Permite agregar headers extras
        },
        ...options,
        });

        // Si el servidor respondió con error
        if (!response.ok) {
        const error = await response.json();
        // Lanzamos el error para que lo capture el catch en el componente
        throw new Error(error.message || 'Error en la petición');
        }

        // Parsear la respuesta como JSON
        return await response.json();

    } catch (error) {
        console.error(`Error en ${endpoint}:`, error);
        throw error; // Re-lanzar para que el componente lo maneje
    }
};