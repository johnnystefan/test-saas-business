import { Module } from '@nestjs/common';
import { GrpcClientsModule } from '../grpc/grpc-clients.module';
import { AuthGrpcService } from './services/auth-proxy.service';
import { AuthProxyController } from './controllers/auth-proxy.controller';

@Module({
  imports: [GrpcClientsModule],
  controllers: [AuthProxyController],
  providers: [AuthGrpcService],
})
export class ProxyAuthModule {}
