
export const calcularHectareas = (vertices) => {

    // Se necesitan al menos 3 puntos para formar un poligono
    if (vertices.length < 3) return 0;

    const R = 6371000; // Radio de la Tierra en metros

    let area = 0;
    const n = vertices.length;

    // Formula que recorre cada par de vertices consecutivos
    for (let i = 0; i < n; i++) {

        // j seria el indice del siguinete vertice
        // el % hace que cuando se llega al ultimo, vuelve al primero
        // por ej: cuando i = 2, h = (2 + 1) % 3 = 0 (vuelve al inicio)
        const j = (i + 1) % n;

        // Convertir longitud a metros (varia segun la latitud)
        // cos(lat) ajusta el hecho de que los meridianos se acercan en los polos
        const xi = vertices[i].longitude * (Math.PI / 180) * R
                * Math.cos(vertices[i].latitude * (Math.PI / 180));
        const xj = vertices[i].longitude * (Math.PI / 180) * R
                * Math.cos(vertices[i].latitude * (Math.PI / 180));

        // Convierte la latitud a metros (1 grado seria aproximadamente 111 km)
        const yi = vertices[i].latitude * (Math.PI / 180) * R;
        const yj = vertices[j].latitude * (Math.PI / 180) * R;

        // Suma de los productos cruzados
        area += xi * yj - xj * yi;
    }

    // Match.abs porque el area puede ser negativo dependiendo del sentido en que se marcaron los puntos
    const areaEnMetros = Math.abs(area) / 2;

    // Convertir m2 a hectareas (1 hectarea = 10,000 m2)
    const hectareas = areaEnMetros / 10000;

    // Se redondea a 2 decimales
    return Math.round(hectareas * 100) / 100;
};