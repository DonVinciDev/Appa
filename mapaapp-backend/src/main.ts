import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para que le front pueda conectarse
  app.enableCors();

  // Habilitar validacion global
  // Esto hace que los DTOs funcionen automaticamente
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina campos que no esten en el DTO
    forbidNonWhitelisted: true, // Lanza un error si hay campos que no esten en el DTO
    transform: true // Convierte tipos automticamente
  }));

  await app.listen(3000);
  console.log('Backend corriendo en puerto 3000')
}
bootstrap();
