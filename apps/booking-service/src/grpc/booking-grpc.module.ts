import { Module } from '@nestjs/common';
import { BookingGrpcController } from './booking-grpc.controller';

@Module({
  controllers: [BookingGrpcController],
})
export class BookingGrpcModule {}
