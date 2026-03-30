import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthGrpcController } from './grpc/auth-grpc.controller';
import { RegisterProvider } from './providers/register.provider';
import { LoginProvider } from './providers/login.provider';
import { RefreshProvider } from './providers/refresh.provider';
import { LogoutProvider } from './providers/logout.provider';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { PrismaUserRepository } from '../infrastructure/prisma/prisma-user.repository';
import { AUTH_TOKENS } from './auth.tokens';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController, AuthGrpcController],
  providers: [
    PrismaService,
    { provide: AUTH_TOKENS.USER_REPOSITORY, useClass: PrismaUserRepository },
    RegisterProvider,
    LoginProvider,
    RefreshProvider,
    LogoutProvider,
    JwtStrategy,
  ],
})
export class AuthModule {}
