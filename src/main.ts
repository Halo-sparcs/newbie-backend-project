import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://192.249.30.11:8080',
    credentials: true, // 쿠키 전송 허용
  });
  app.use(cookieParser());

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
