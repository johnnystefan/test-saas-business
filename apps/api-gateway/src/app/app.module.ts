import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ProxyAuthModule } from './proxy-auth/proxy-auth.module';
import { ProxyBookingModule } from './proxy-booking/proxy-booking.module';
import { ProxyClubModule } from './proxy-club/proxy-club.module';
import { ProxyFinanceModule } from './proxy-finance/proxy-finance.module';
import { ProxyInventoryModule } from './proxy-inventory/proxy-inventory.module';

@Module({
  imports: [
    HealthModule,
    ProxyAuthModule,
    ProxyClubModule,
    ProxyBookingModule,
    ProxyInventoryModule,
    ProxyFinanceModule,
  ],
})
export class AppModule {}
