import { Module } from '@nestjs/common';
import { InventoryGrpcController } from './inventory-grpc.controller';

@Module({
  controllers: [InventoryGrpcController],
})
export class InventoryGrpcModule {}
