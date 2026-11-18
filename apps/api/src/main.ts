import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Manejo global para serialización segura de BigInt en JSON (evita TypeError: Do not know how to serialize a BigInt)
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global de API versionada
  app.setGlobalPrefix('api/v1');

  // Tubería global de validación y sanitización estricta de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Habilitación de CORS para el frontend React Vite
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

if (process.env.NODE_ENV !== 'test') {
  bootstrap();
}
