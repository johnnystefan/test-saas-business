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

// In production (Docker), services communicate via container name (e.g. "auth-service").
// In dev (nx serve), all services run on localhost.
// GRPC_HOST is injected per-service via Docker Compose environment.
const protoDir =
  process.env['GRPC_PROTO_DIR'] ??
  join(__dirname, '../../../../libs/grpc/protos');

const authHost = process.env['GRPC_AUTH_HOST'] ?? 'localhost';
const clubHost = process.env['GRPC_CLUB_HOST'] ?? 'localhost';
const bookingHost = process.env['GRPC_BOOKING_HOST'] ?? 'localhost';
const financeHost = process.env['GRPC_FINANCE_HOST'] ?? 'localhost';
const inventoryHost = process.env['GRPC_INVENTORY_HOST'] ?? 'localhost';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: GRPC_AUTH_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(protoDir, 'auth.proto'),
          url: `${authHost}:${GRPC_PORTS.AUTH}`,
          loader: { keepCase: true },
        },
      },
      {
        name: GRPC_CLUB_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'club',
          protoPath: join(protoDir, 'club.proto'),
          url: `${clubHost}:${GRPC_PORTS.CLUB}`,
          loader: { keepCase: true },
        },
      },
      {
        name: GRPC_BOOKING_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'booking',
          protoPath: join(protoDir, 'booking.proto'),
          url: `${bookingHost}:${GRPC_PORTS.BOOKING}`,
          loader: { keepCase: true },
        },
      },
      {
        name: GRPC_FINANCE_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'finance',
          protoPath: join(protoDir, 'finance.proto'),
          url: `${financeHost}:${GRPC_PORTS.FINANCE}`,
          loader: { keepCase: true },
        },
      },
      {
        name: GRPC_INVENTORY_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'inventory',
          protoPath: join(protoDir, 'inventory.proto'),
          url: `${inventoryHost}:${GRPC_PORTS.INVENTORY}`,
          loader: { keepCase: true },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcClientsModule {}
