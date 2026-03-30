import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuthGrpcService } from '../services/auth-proxy.service';
import type {
  GrpcLoginResponse,
  GrpcRefreshResponse,
  GrpcRegisterResponse,
  GrpcLogoutResponse,
} from '@saas/grpc';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

interface RegisterBody {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly role?: string;
}

interface LoginBody {
  readonly email: string;
  readonly password: string;
}

interface RefreshBody {
  readonly refreshToken: string;
}

interface LogoutBody {
  readonly refreshToken: string;
}

@Controller('auth')
export class AuthProxyController {
  constructor(private readonly authGrpcService: AuthGrpcService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() body: RegisterBody,
    @Headers('x-tenant-id') tenantId: string,
  ): Promise<GrpcRegisterResponse> {
    if (!tenantId)
      throw new BadRequestException('x-tenant-id header is required');
    return this.authGrpcService.register({
      email: body.email,
      password: body.password,
      name: body.name,
      tenant_id: tenantId,
      role: body.role ?? 'MEMBER',
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginBody,
    @Headers('x-tenant-id') tenantId: string,
  ): Promise<GrpcLoginResponse> {
    if (!tenantId)
      throw new BadRequestException('x-tenant-id header is required');
    return this.authGrpcService.login({
      email: body.email,
      password: body.password,
      tenant_id: tenantId,
    });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: RefreshBody): Promise<GrpcRefreshResponse> {
    return this.authGrpcService.refresh({ refresh_token: body.refreshToken });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() body: LogoutBody): Promise<GrpcLogoutResponse> {
    return this.authGrpcService.logout({ refresh_token: body.refreshToken });
  }
}
