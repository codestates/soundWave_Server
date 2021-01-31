import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  // const fs = require('fs');
  // const keyFile = fs.readFileSync(__dirname + '/../../key.pem');
  // const certFile = fs.readFileSync(__dirname + '/../../cert.pem');

  const app = await NestFactory.create(AppModule, {
    // httpsOptions: {
    //   key: keyFile,
    //   cert: certFile,
    // },
  });

  app.use(cookieParser());

  app.enableCors({
    // origin: ['https://localhost:3001'],
    origin: ['https://www.sounds-wave.com'],
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'OPTIONS', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(3000);
}
bootstrap();
