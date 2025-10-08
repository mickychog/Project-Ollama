// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseService } from './database.service'; // ⬅️ IMPORTAR

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:3000' });

  // ⬇️ INICIALIZAR CONEXIÓN A BASE DE DATOS
  const databaseService = app.get(DatabaseService);
  await databaseService.connect();

  await app.listen(3001);
  console.log('✅ Proxy server running on http://localhost:3001');
  console.log('🗄️ Database service initialized');
}
bootstrap();