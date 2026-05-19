import { fetchAPI } from './api';


export const obtenerAreasPorUsuario = async (usuarioId) => {
    try {
        // El query param ?usuarioId=X filtra las áreas del usuario
        const areas = await fetchAPI(`/areas?usuarioId=${usuarioId}`);
        return areas;
    } catch (error) {
        console.error('Error al obtener áreas:', error);
        return [];
    }
};

//Obtener TODAS las áreas (para supervisor) Llama a: GET /areas
export const obtenerTodasLasAreas = async () => {
  try {
    const areas = await fetchAPI('/areas');
    return areas;
  } catch (error) {
    console.error('Error al obtener todas las áreas:', error);
    return [];
  }
};

// Guardar una nueva area
export const guardarArea = async (nuevaArea, usuarioId) => {
  try {
    // Armamos el objeto que el backend espera (CrearAreaDto)
    const areaParaEnviar = {
      nombreAgricultor: nuevaArea.nombreAgricultor,
      tipoPlantacion: nuevaArea.tipoPlantacion,
      comentario: nuevaArea.comentario || '',
      imagenUrl: nuevaArea.imagen || null,
      hectareas: nuevaArea.hectareas,
      vertices: nuevaArea.vertices,
      usuarioId: usuarioId,
    };

    const areaCreada = await fetchAPI('/areas', {
      method: 'POST',
      body: JSON.stringify(areaParaEnviar),
    });

    return areaCreada;

  } catch (error) {
    console.error('Error al guardar área:', error);
    throw error;
  }
};


export const eliminarArea = async (id) => {
  try {
    await fetchAPI(`/areas/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error al eliminar área:', error);
    throw error;
  }
};


export const formatearFecha = (fecha) => {
  try {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return 'Sin fecha';
  }
};