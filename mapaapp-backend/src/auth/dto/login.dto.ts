// Define la estructura de los datos que llegan al endpoint
// class-validator valida automaticamente que los campos cumplan las reglas

import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'El email no es válido' })
    email: string;

    @IsString({ message: 'La contraseña debe ser un string' })
    @MinLength(4, { message: 'La contraseña debe tener al menos 4 caracteres' })
    password: string;
}
