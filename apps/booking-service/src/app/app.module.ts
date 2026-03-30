import { Module } from '@nestjs/common';
import { HealthModule } from '../health/health.module';
import { BookingGrpcModule } from '../grpc/booking-grpc.module';

@Module({
  imports: [HealthModule, BookingGrpcModule],
})
export class AppModule {}
