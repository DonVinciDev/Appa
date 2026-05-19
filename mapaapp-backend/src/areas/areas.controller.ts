
import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CrearAreaDto } from './dto/crear-area.dto';

@Controller('areas')
export class AreasController {

    constructor(private areasService: AreasService) {}

    // POST /areas → Crear nueva área
    @Post()
    async crear(@Body() dto: CrearAreaDto) {
        return this.areasService.crear(dto);
    }

    // GET /areas?usuarioId=1 = Áreas de un usuario
    // GET /areas = Todas las áreas (supervisor)
    // @Query extrae los parámetros de la URL (?usuarioId=1)
    @Get()
    async obtener(@Query('usuarioId') usuarioId?: string) {
        if (usuarioId) {
        return this.areasService.obtenerPorUsuario(Number(usuarioId));
        }
        return this.areasService.obtenerTodas();
    }

    // GET /areas/3 = Un área específica
    // ParseIntPipe convierte el string "3" a número 3
    @Get(':id')
    async obtenerUna(@Param('id', ParseIntPipe) id: number) {
        return this.areasService.obtenerPorId(id);
    }

    // DELETE /areas/3 = Eliminar un área
    @Delete(':id')
    async eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.areasService.eliminar(id);
    }
}