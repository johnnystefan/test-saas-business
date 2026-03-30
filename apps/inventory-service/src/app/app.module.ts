import { Module } from '@nestjs/common';
import { HealthModule } from '../health/health.module';
import { InventoryGrpcModule } from '../grpc/inventory-grpc.module';

@Module({
  imports: [HealthModule, InventoryGrpcModule],
})
export class AppModule {}
