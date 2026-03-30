import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { ZodValidationPipe } from 'nestjs-zod';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { DomainErrorFilter } from '@saas/nestjs-utils';
import { GRPC_PORTS } from '@saas/grpc';
import { getEnvPort } from '@saas/shared-utils';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // HTTP: health check only
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new DomainErrorFilter());

  // gRPC microservice
  // In production build, copy proto files to dist; adjust path accordingly
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'club',
      protoPath: join(__dirname, '../../../libs/grpc/protos/club.proto'),
      url: `0.0.0.0:${GRPC_PORTS.CLUB}`,
    },
  });

  app.enableShutdownHooks();

  await app.startAllMicroservices();

  const port = getEnvPort('CLUB_SERVICE_PORT', 3002);
  await app.listen(port);

  Logger.log(`Club service HTTP running on port ${port}`, 'Bootstrap');
  Logger.log(
    `Club service gRPC running on port ${GRPC_PORTS.CLUB}`,
    'Bootstrap',
  );
}

bootstrap();
