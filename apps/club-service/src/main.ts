import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app/app.module';
import { DomainErrorFilter } from '@saas/nestjs-utils';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new DomainErrorFilter());
  const port = process.env['CLUB_SERVICE_PORT'] || 3002;
  await app.listen(port);
  Logger.log(
    `Club service running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
