import { Module } from '@nestjs/common';
import { FinanceGrpcController } from './finance-grpc.controller';

@Module({
  controllers: [FinanceGrpcController],
})
export class FinanceGrpcModule {}
