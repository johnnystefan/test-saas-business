import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
import { UserRoleSchema } from '@saas/shared-types';
import type {
  GrpcRegisterRequest,
  GrpcRegisterResponse,
  GrpcLoginRequest,
  GrpcLoginResponse,
  GrpcRefreshRequest,
  GrpcRefreshResponse,
  GrpcLogoutRequest,
  GrpcLogoutResponse,
  GrpcValidateTokenRequest,
  GrpcValidateTokenResponse,
} from '@saas/grpc';
import { RegisterProvider } from '../providers/register.provider';
import { LoginProvider } from '../providers/login.provider';
import { RefreshProvider } from '../providers/refresh.provider';
import { LogoutProvider } from '../providers/logout.provider';

@Controller()
export class AuthGrpcController {
  constructor(
    private readonly registerProvider: RegisterProvider,
    private readonly loginProvider: LoginProvider,
    private readonly refreshProvider: RefreshProvider,
    private readonly logoutProvider: LogoutProvider,
  ) {}

  @GrpcMethod('AuthService', 'Register')
  async register(data: GrpcRegisterRequest): Promise<GrpcRegisterResponse> {
    if (!data.tenant_id) throw new RpcException('tenant_id is required');
    const role = UserRoleSchema.parse(data.role);
    const result = await this.registerProvider.handle({
      email: data.email,
      password: data.password,
      name: data.name,
      tenantId: data.tenant_id,
      role,
    });
    return {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: data.role,
      tenant_id: data.tenant_id,
    };
  }

  @GrpcMethod('AuthService', 'Login')
  async login(data: GrpcLoginRequest): Promise<GrpcLoginResponse> {
    if (!data.tenant_id) throw new RpcException('tenant_id is required');
    const result = await this.loginProvider.handle({
      email: data.email,
      password: data.password,
      tenantId: data.tenant_id,
    });
    return {
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
      user: {
        id: result.user.userId,
        email: result.user.email,
        name: '',
        role: result.user.role,
        tenant_id: result.user.tenantId,
      },
    };
  }

  @GrpcMethod('AuthService', 'Refresh')
  async refresh(data: GrpcRefreshRequest): Promise<GrpcRefreshResponse> {
    const result = await this.refreshProvider.handle({
      refreshToken: data.refresh_token,
    });
    return {
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
    };
  }

  @GrpcMethod('AuthService', 'Logout')
  async logout(data: GrpcLogoutRequest): Promise<GrpcLogoutResponse> {
    await this.logoutProvider.handle({ refreshToken: data.refresh_token });
    return { success: true };
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  validateToken(_data: GrpcValidateTokenRequest): GrpcValidateTokenResponse {
    // TODO: inject JwtService to implement proper token validation
    return {
      valid: false,
      user: { id: '', email: '', name: '', role: '', tenant_id: '' },
    };
  }
}
