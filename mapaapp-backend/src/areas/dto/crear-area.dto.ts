
import { IsString, IsNumber, IsOptional, IsArray, MinLength, Min } from "class-validator";

export class CrearAreaDto {

    @IsString()
    @MinLength(2, { message: 'El nombre del agricultor es muy corto' })
    nombreAgricultor: string;

    @IsString()
    tipoPlantacion: string;

    @IsOptional()
    @IsString()
    comentario?: string;

    @IsOptional()
    @IsString()
    imagenUrl?: string;

    @IsNumber()
    @Min(0)
    hectareas: number;

    // Array de vértices
    @IsArray()
    vertices: { latitude: number; longitude: number }[];

    @IsNumber()
    usuarioId: number;

}