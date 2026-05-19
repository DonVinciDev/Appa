
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAPI } from './api';

// Clave donde guardamos la sesión activa en el dispositivo
const SESSION_KEY = '@mapaapp:sesion';

export const login = async (email, password) => {
    try {
        // POST /auth/login → envía las credenciales al backend
        const usuario = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        });

        // Si el backend respondió correctamente, guardamos la sesión localmente
        // Así el usuario no tiene que loguearse cada vez que abre la app
        const sesion = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        };

        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
        return sesion;

    } catch (error) {
        console.error('Error en login:', error);
        return null; // null = credenciales incorrectas
    }
    };

    // Cerrar sesión, solo borra la sesión local (no hay endpoint en el backend para esto)
    export const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    };

    // Obtener la sesión activa, lee de AsyncStorage si hay un usuario logueado
    export const obtenerSesion = async () => {
    try {
        const json = await AsyncStorage.getItem(SESSION_KEY);
        return json ? JSON.parse(json) : null;
    } catch (error) {
        console.error('Error al obtener sesión:', error);
        return null;
    }
};