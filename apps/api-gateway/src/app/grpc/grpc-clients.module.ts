import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  GRPC_AUTH_SERVICE,
  GRPC_CLUB_SERVICE,
  GRPC_BOOKING_SERVICE,
  GRPC_FINANCE_SERVICE,
  GRPC_INVENTORY_SERVICE,
  GRPC_PORTS,
} from '@saas/grpc';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: GRPC_AUTH_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, '../../../../libs/grpc/protos/auth.proto'),
          url: `localhost:${GRPC_PORTS.AUTH}`,
        },
      },
      {
        name: GRPC_CLUB_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'club',
          protoPath: join(__dirname, '../../../../libs/grpc/protos/club.proto'),
          url: `localhost:${GRPC_PORTS.CLUB}`,
        },
      },
      {
        name: GRPC_BOOKING_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'booking',
          protoPath: join(
            __dirname,
            '../../../../libs/grpc/protos/booking.proto',
          ),
          url: `localhost:${GRPC_PORTS.BOOKING}`,
        },
      },
      {
        name: GRPC_FINANCE_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'finance',
          protoPath: join(
            __dirname,
            '../../../../libs/grpc/protos/finance.proto',
          ),
          url: `localhost:${GRPC_PORTS.FINANCE}`,
        },
      },
      {
        name: GRPC_INVENTORY_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'inventory',
          protoPath: join(
            __dirname,
            '../../../../libs/grpc/protos/inventory.proto',
          ),
          url: `localhost:${GRPC_PORTS.INVENTORY}`,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcClientsModule {}
