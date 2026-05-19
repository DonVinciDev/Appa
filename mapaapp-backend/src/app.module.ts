import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AreasModule } from './areas/areas.module';

@Module({
  imports: [
    PrismaModule, // Conexion a la BD
    AuthModule, // Login de usuarios
    AreasModule, // CRUD de areas
  ],
})
export class AppModule {}
