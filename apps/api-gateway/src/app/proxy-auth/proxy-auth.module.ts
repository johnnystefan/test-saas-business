import { Module } from '@nestjs/common';
import { HttpProxyModule } from '@saas/http-proxy';
import { AuthModule } from '../auth/auth.module';
import { AuthProxyController } from './controllers/auth-proxy.controller';
import { AuthProxyService } from './services/auth-proxy.service';

@Module({
  imports: [HttpProxyModule, AuthModule],
  controllers: [AuthProxyController],
  providers: [AuthProxyService],
  exports: [AuthProxyService],
})
export class ProxyAuthModule {}
