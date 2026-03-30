import { Module } from '@nestjs/common';
import { BookingProxyController } from './controllers/booking-proxy.controller';

@Module({
  controllers: [BookingProxyController],
})
export class ProxyBookingModule {}
