
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Seed = datos iniciales para la BD
// Se ejecuta una vez para llenar la BD con datos de prueba
async function main() {

    console.log('Creando usuarios de prueba...');

    // Crear usuarios (mismos que teníamos en el frontend)
    await prisma.usuario.upsert({
        where: { email: 'juan@empresa.com' },
        update: {},
        create: {
        nombre: 'Juan Pérez',
        email: 'juan@empresa.com',
        password: await bcrypt.hash('1234', 10),
        rol: 'usuario',
        },
    });

    await prisma.usuario.upsert({
        where: { email: 'maria@empresa.com' },
        update: {},
        create: {
        nombre: 'María López',
        email: 'maria@empresa.com',
        password: await bcrypt.hash('1234', 10),
        rol: 'usuario',
        },
    });

    await prisma.usuario.upsert({
        where: { email: 'admin@empresa.com' },
        update: {},
        create: {
        nombre: 'Admin Supervisor',
        email: 'admin@empresa.com',
        password: await bcrypt.hash('admin1234', 10),
        rol: 'supervisor',
        },
    });

    console.log('Usuarios creados correctamente :D');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });