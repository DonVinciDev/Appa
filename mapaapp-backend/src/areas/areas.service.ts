
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearAreaDto } from './dto/crear-area.dto';

@Injectable()
export class AreasService {

    constructor(private prisma: PrismaService) {}

    // Crear una nueva área
    async crear(dto: CrearAreaDto) {

        // Paso 1: Convertir los vértices a formato WKT (Well-Known Text)
        // PostGIS entiende este formato para crear geometrías
        // Ejemplo: POLYGON((-70.65 -33.45, -70.64 -33.44, -70.63 -33.45, -70.65 -33.45))
        // IMPORTANTE: PostGIS usa el orden (longitud, latitud), NO (latitud, longitud)
        const wkt = this.verticesAWkt(dto.vertices);

        // Paso 2: Crear el registro en la BD
        // Usamos $queryRaw para insertar la geometría con PostGIS porque Prisma no soporta geometrías directamente
        const area = await this.prisma.area.create({
        data: {
            nombreAgricultor: dto.nombreAgricultor,
            tipoPlantacion: dto.tipoPlantacion,
            comentario: dto.comentario,
            imagenUrl: dto.imagenUrl,
            hectareas: dto.hectareas,
            vertices: dto.vertices, // Guardamos también como JSON
            usuarioId: dto.usuarioId,
        },
        });

        // Paso 3: Actualizar la columna geometry con PostGIS
        // ST_GeomFromText convierte el WKT a geometría PostGIS
        // 4326 es el sistema de coordenadas (WGS84 = GPS)
        await this.prisma.$executeRaw`
        UPDATE areas 
        SET geometry = ST_GeomFromText(${wkt}, 4326)
        WHERE id = ${area.id}
        `;

        return area;
    }

    // Obtener áreas de un usuario específico
    async obtenerPorUsuario(usuarioId: number) {
        return this.prisma.area.findMany({
        where: { usuarioId },
        orderBy: { createdAt: 'desc' }, // Más recientes primero
        });
    }

    // Obtener todas las áreas , esto es solo para el supervisor
    async obtenerTodas() {
        return this.prisma.area.findMany({
        include: { usuario: { select: { nombre: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        });
    }

    // Obtener un área por id
    async obtenerPorId(id: number) {
        const area = await this.prisma.area.findUnique({
        where: { id },
        include: { usuario: { select: { nombre: true, email: true } } },
        });

        if (!area) {
        throw new NotFoundException('Área no encontrada');
        }

        return area;
    }

    // Eliminar un área
    async eliminar(id: number) {
        // Verificar que existe
        await this.obtenerPorId(id);
        return this.prisma.area.delete({ where: { id } });
    }


    // FUncion auxiliar

    // Convierte los vertices del front a formato WKT de PostGIS
    private verticesAWkt(vertices: { latitude: number; longitude: number }[]): string {

        // Mapeamos cada vertice a longitud / latitud
        const puntos = vertices.map(v => `${v.longitude} ${v.latitude}`)

        // PostGIS necesita que le poligono cierre, asi que el ultimo debe ser igual que el primero
        const primerPunto = `${vertices[0].longitude} ${vertices[0].latitude}`
        puntos.push(primerPunto)

        // Formato final seria = POLYGON((lng1, lat1, lng2, lat2, ... ..., lng1, lat1))
        return `POLYGON((${puntos.join(', ')} ))`
    }
}