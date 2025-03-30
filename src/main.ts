import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const isLocal = process.env.NODE_ENV !== 'production'; // Cek apakah sedang running lokal

  const adapter = isLocal
    ? new FastifyAdapter({
        https: {
          key: fs.readFileSync('./src/certificates/localhost-key.pem'),
          cert: fs.readFileSync('./src/certificates/localhost.pem'),
        },
      })
    : new FastifyAdapter(); // Tidak menggunakan HTTPS di production

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  app.enableCors({
    origin: '*', // Atur sesuai kebutuhan
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const PORT = 8000;
  await app.listen(PORT, '0.0.0.0'); // Pastikan listen ke semua IP

  console.log(
    `🚀 Server berjalan di port ${PORT} dengan mode ${isLocal ? 'HTTPS (Lokal)' : 'HTTP (Koyeb)'}`,
  );
}

bootstrap();
