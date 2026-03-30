import { Module } from '@nestjs/common';
import { FinanceProxyController } from './controllers/finance-proxy.controller';

@Module({
  controllers: [FinanceProxyController],
})
export class ProxyFinanceModule {}
