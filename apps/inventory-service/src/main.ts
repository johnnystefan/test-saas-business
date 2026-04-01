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

  // In production build, copy proto files to dist; adjust path accordingly
  const protoDir =
    process.env['GRPC_PROTO_DIR'] ??
    join(__dirname, '../../../libs/grpc/protos');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'inventory',
      protoPath: join(protoDir, 'inventory.proto'),
      url: `0.0.0.0:${GRPC_PORTS.INVENTORY}`,
      loader: { keepCase: true },
    },
  });

  await app.startAllMicroservices();
  const port = getEnvPort('INVENTORY_SERVICE_PORT', 3005);
  await app.listen(port);

  Logger.log('Inventory HTTP running on port ' + String(port), 'Bootstrap');
  Logger.log(
    'Inventory gRPC running on port ' + String(GRPC_PORTS.INVENTORY),
    'Bootstrap',
  );
}

bootstrap();
