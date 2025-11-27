import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port =
    configService.get<number>('app.apiPort', { infer: true }) ?? 3000;
  const frontendOrigin =
    configService.get<string>('app.frontendOrigin', { infer: true }) ??
    'http://localhost:5173';

  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port);
  console.info(`🚀 API is running on http://localhost:${port}`);
}
bootstrap();
