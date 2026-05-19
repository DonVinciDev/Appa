import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Este servicio maneja la conexión a la BD
// Extiende PrismaClient para poder usar this.usuario.findMany(), etc.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  // Se conecta a la BD cuando el módulo se inicia
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Conectado a PostgreSQL');
  }

  // Se desconecta cuando la app se cierra
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Desconectado de PostgreSQL');
  }
}