import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app/app.module';
import { DomainErrorFilter } from '@saas/nestjs-utils';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new DomainErrorFilter());
  const port = process.env['PORT'] ?? 3000;
  await app.listen(port);
  Logger.log(`Auth service running on: http://localhost:${port}/api/v1`);
}

bootstrap();
