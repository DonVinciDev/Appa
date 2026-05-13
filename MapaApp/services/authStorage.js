import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@mapaapp_session';

// Usuarios precargados para simular el login
const USUARIOS = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@test.com', password: '1234' },
    { id: 2, nombre: 'María Gómez', email: 'maria@test.com', password: '1234' },
    { id: 3, nombre: 'Carlos López', email: 'carlos@test.com', password: '1234' }
];

export const login = async (email, password) => {

    // Se busca el usuario en la lista de usuarios precargados
    const usuario = USUARIOS.find(u => u.email === email.toLowerCase().trim() && u.password === password);

    // Si no existe, retorna null
    if (!usuario) return null;

    // Si existe, se guarda la sesión en AsyncStorage sin pass por seguridad
    const sesion = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email        
    };

    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sesion));

    return sesion;
};

// Cierre de sesion
export const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
};

export const obtenerSesion = async () => {
    const json = await AsyncStorage.getItem(SESSION_KEY);
    return json ? JSON.parse(json) : null;
};