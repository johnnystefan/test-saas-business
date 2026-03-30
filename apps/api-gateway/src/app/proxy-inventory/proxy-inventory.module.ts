import { Module } from '@nestjs/common';
import { InventoryProxyController } from './controllers/inventory-proxy.controller';

@Module({
  controllers: [InventoryProxyController],
})
export class ProxyInventoryModule {}
