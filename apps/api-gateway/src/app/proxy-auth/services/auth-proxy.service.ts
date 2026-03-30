import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type { Observable } from 'rxjs';
import { GRPC_AUTH_SERVICE } from '@saas/grpc';
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

interface AuthServiceGrpcClient {
  register(data: GrpcRegisterRequest): Observable<GrpcRegisterResponse>;
  login(data: GrpcLoginRequest): Observable<GrpcLoginResponse>;
  refresh(data: GrpcRefreshRequest): Observable<GrpcRefreshResponse>;
  logout(data: GrpcLogoutRequest): Observable<GrpcLogoutResponse>;
  validateToken(
    data: GrpcValidateTokenRequest,
  ): Observable<GrpcValidateTokenResponse>;
}

@Injectable()
export class AuthGrpcService implements OnModuleInit {
  private readonly logger = new Logger(AuthGrpcService.name);
  private authService!: AuthServiceGrpcClient;

  constructor(@Inject(GRPC_AUTH_SERVICE) private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.authService =
      this.client.getService<AuthServiceGrpcClient>('AuthService');
    this.logger.log('AuthGrpcService initialized');
  }

  async register(data: GrpcRegisterRequest): Promise<GrpcRegisterResponse> {
    return firstValueFrom(this.authService.register(data));
  }

  async login(data: GrpcLoginRequest): Promise<GrpcLoginResponse> {
    return firstValueFrom(this.authService.login(data));
  }

  async refresh(data: GrpcRefreshRequest): Promise<GrpcRefreshResponse> {
    return firstValueFrom(this.authService.refresh(data));
  }

  async logout(data: GrpcLogoutRequest): Promise<GrpcLogoutResponse> {
    return firstValueFrom(this.authService.logout(data));
  }

  async validateToken(
    data: GrpcValidateTokenRequest,
  ): Promise<GrpcValidateTokenResponse> {
    return firstValueFrom(this.authService.validateToken(data));
  }
}
