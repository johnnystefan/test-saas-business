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
  // GRPC_PROTO_DIR is set in production (Docker) to the absolute path where
  // .proto files are copied. In dev (nx serve) it falls back to the monorepo path.
  const protoDir =
    process.env['GRPC_PROTO_DIR'] ??
    join(__dirname, '../../../libs/grpc/protos');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(protoDir, 'auth.proto'),
      url: `0.0.0.0:${GRPC_PORTS.AUTH}`,
      loader: { keepCase: true },
    },
  });

  app.enableShutdownHooks();

  await app.startAllMicroservices();

  const httpPort = getEnvPort('PORT', 3000);
  await app.listen(httpPort);

  Logger.log(`Auth service HTTP running on port ${httpPort}`, 'Bootstrap');
  Logger.log(
    `Auth service gRPC running on port ${GRPC_PORTS.AUTH}`,
    'Bootstrap',
  );
}

bootstrap();
