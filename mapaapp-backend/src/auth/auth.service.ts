
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    // Inyeccion de dependencias: NestJS no da la instancia de PrismaService
    constructor(private prisma: PrismaService) {}

    async login(loginDto: LoginDto) {

        // Buscar el usuario por email
        const usuario = await this.prisma.usuario.findUnique({
            where: { email: loginDto.email },
        })

        // Si no existe, error
        if (!usuario) {
            throw new UnauthorizedException('Email o constraseña incorrectos');
        }

        // Comparar la pass ingresada con la de BD
        // bcrypt.compare se encarga de la comparacion segura
        const passwordValida = await bcrypt.compare(loginDto.password, usuario.password);

        // Si no coinciden, error
        if (!passwordValida) {
            throw new UnauthorizedException('Email o constraseña incorrectos');
        }

        // DEvolver al usuario sinpass por seguridad
        const { password, ...usuarioSinPassword } = usuario;
        return usuarioSinPassword;

    }

    // Crear un usuario (solo para supervisor / admin)
    async crearUsuario(nombre: string, email: string, passwordPlana: string, rol: string = 'usuario') {

        // bcrypt.hash encripta la pass
        // el 10 es el "salt rounds" que seria cuantas veces se encripta
        const passwordHasheada = await bcrypt.hash(passwordPlana, 10);

        // Crear el usuario
        const usuario = await this.prisma.usuario.create({
            data: {
                nombre,
                email,
                password: passwordHasheada,
                rol,
            },
        });

        // Devolver al usuario sinpass por seguridad
        const { password, ...usuarioSinPassword } = usuario;
        return usuarioSinPassword;

    }
}