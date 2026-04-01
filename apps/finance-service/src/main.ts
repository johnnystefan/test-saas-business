import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { GRPC_PORTS } from '@saas/grpc';
import { getEnvPort } from '@saas/shared-utils';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableShutdownHooks();

  const protoDir =
    process.env['GRPC_PROTO_DIR'] ??
    join(__dirname, '../../../libs/grpc/protos');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'finance',
      protoPath: join(protoDir, 'finance.proto'),
      url: `0.0.0.0:${GRPC_PORTS.FINANCE}`,
      loader: { keepCase: true },
    },
  });

  await app.startAllMicroservices();
  const port = getEnvPort('FINANCE_SERVICE_PORT', 3004);
  await app.listen(port);

  Logger.log('Finance HTTP running on port ' + String(port), 'Bootstrap');
  Logger.log(
    'Finance gRPC running on port ' + String(GRPC_PORTS.FINANCE),
    'Bootstrap',
  );
}

bootstrap();
