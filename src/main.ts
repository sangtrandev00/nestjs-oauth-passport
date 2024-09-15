import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000; // Default to 4000 if not set
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true
  })
  app.use(cookieParser())
  await app.listen(port);
}
bootstrap();
