import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      https: {
        key: fs.readFileSync('./src/certificates/localhost-key.pem'),
        cert: fs.readFileSync('./src/certificates/localhost.pem'),
      },
    }),
  );

  app.enableCors({
    origin: '*', // Atau ganti dengan domain Astro, contoh: "http://localhost:4321"
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3002);
}

bootstrap();
