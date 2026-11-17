import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Prefijo global de API versionada
  app.setGlobalPrefix('api/v1');
  
  // Habilitación de CORS para el frontend React Vite
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  // Solo escucha si se invoca explícitamente el servidor
  await app.listen(port);
}

if (process.env.NODE_ENV !== 'test') {
  bootstrap();
}

