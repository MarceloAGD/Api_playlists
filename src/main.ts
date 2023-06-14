import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from 'cors';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar opciones de CORS
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(AppModule.port);
}

bootstrap();
