import { Inject, Injectable } from '@nestjs/common';
import {
  signAccessToken,
  signRefreshToken,
  getRefreshTokenExpiresAt,
  type JwtPayload,
  type TokenPair,
} from '@saas/auth-utils';
import {
  RefreshUseCase,
  type RefreshOutput,
} from '../../domain/use-cases/refresh.use-case';
import type { IUserRepository } from '../../domain/user/i-user.repository';
import { AUTH_TOKENS } from '../auth.tokens';
import { requireEnv } from '../utils/require-env';

const JWT_SECRET = requireEnv('JWT_SECRET');

@Injectable()
export class RefreshProvider extends RefreshUseCase {
  constructor(
    @Inject(AUTH_TOKENS.USER_REPOSITORY) userRepository: IUserRepository,
  ) {
    super(userRepository);
  }

  async handle(
    dto: Parameters<RefreshUseCase['execute']>[0],
  ): Promise<TokenPair> {
    const result = await this.execute(dto);
    return this.rotatedTokenPair(result);
  }

  private async rotatedTokenPair(result: RefreshOutput): Promise<TokenPair> {
    const payload = this.jwtPayload(result);
    const tokens = this.signedTokenPair(payload);
    await this.userRepository.saveRefreshToken(
      result.userId,
      tokens.refreshToken,
      getRefreshTokenExpiresAt(),
    );
    return tokens;
  }

  private jwtPayload(result: RefreshOutput): JwtPayload {
    return {
      sub: result.userId,
      email: result.email,
      role: result.role,
      tenantId: result.tenantId,
    };
  }

  private signedTokenPair(payload: JwtPayload): TokenPair {
    return {
      accessToken: signAccessToken(payload, JWT_SECRET),
      refreshToken: signRefreshToken(payload, JWT_SECRET),
    };
  }
}
