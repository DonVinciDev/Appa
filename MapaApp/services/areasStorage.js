import AsyncStorage from "@react-native-async-storage/async-storage";

// Clave bajo la cual guardamos en el storage del dispositivo
const STORAGE_KEY = "@mapaapp:areas";


// Obtiene todas las areas guardadas en un array, si no hay nada devuelve un array vacío
export const obtenerAreas = async () => {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        // Se transforma a array con JSON.parse
        return json ? JSON.parse(json) : [];
    } catch (error) {
        console.error("Error al leer áreas: ", error);
        return [];
    }
}

// Guarda una nueva area en el starage, recibe el objeoto area y lo agrega a la lista
export const guardarArea = async (nuevaArea) => {
    try {
        // Primero se obtiene las areas existentes
        const areas = await obtenerAreas();

        // Se agrega un id único y la fecha para identificarla facilemnte despues
        const areaConId = {
            ...nuevaArea,
            id: Date.now().toString(), // id único basado en timestamp
            fechaCreacion: new Date().toISOString(), // Fecha de creación
        };

        // Se crea un nuevo array con la nueva area al final
        const nuevasAreas = [...areas, areaConId];

        // Se convierte a string y se guarda en el storage
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevasAreas));

        return areaConId; // Devuelve el área con su id asignado
    } catch (error) {
        console.error("Error al guardar área: ", error);
        return error;
    }
};

// Eliminar le area por su id
export const eliminarArea = async (id) => {
    try {
        // Se obtienen las areas existentes
        const areas = await obtenerAreas();

        // El .filter devuelve un nuevo array sin el area que queremos eliminar
        const nuevasAreas = areas.filter(area => area.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevasAreas));
    } catch (error) {
        console.error("Error al eliminar área: ", error);
    }
};