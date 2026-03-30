import { Module } from '@nestjs/common';
import { ClubProxyController } from './controllers/club-proxy.controller';

@Module({
  controllers: [ClubProxyController],
})
export class ProxyClubModule {}
