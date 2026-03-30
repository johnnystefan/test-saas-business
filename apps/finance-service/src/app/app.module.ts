import { Module } from '@nestjs/common';
import { HealthModule } from '../health/health.module';
import { FinanceGrpcModule } from '../grpc/finance-grpc.module';

@Module({
  imports: [HealthModule, FinanceGrpcModule],
})
export class AppModule {}
