import { Module } from '@nestjs/common';
import { GrpcClientsModule } from '../grpc/grpc-clients.module';
import { ClubGrpcService } from './services/club-proxy.service';
import { ClubProxyController } from './controllers/club-proxy.controller';

@Module({
  imports: [GrpcClientsModule],
  controllers: [ClubProxyController],
  providers: [ClubGrpcService],
})
export class ProxyClubModule {}
