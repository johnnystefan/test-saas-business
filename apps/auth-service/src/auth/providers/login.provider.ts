import { Inject, Injectable } from '@nestjs/common';
import {
  signAccessToken,
  signRefreshToken,
  getRefreshTokenExpiresAt,
  type JwtPayload,
  type TokenPair,
} from '@saas/auth-utils';
import {
  LoginUseCase,
  type LoginOutput,
} from '../../domain/use-cases/login.use-case';
import type { IUserRepository } from '../../domain/user/i-user.repository';
import { AUTH_TOKENS } from '../auth.tokens';
import { requireEnv } from '../utils/require-env';

const JWT_SECRET = requireEnv('JWT_SECRET');

@Injectable()
export class LoginProvider extends LoginUseCase {
  constructor(
    @Inject(AUTH_TOKENS.USER_REPOSITORY) userRepository: IUserRepository,
  ) {
    super(userRepository);
  }

  async handle(
    dto: Parameters<LoginUseCase['execute']>[0],
  ): Promise<TokenPair> {
    const result = await this.execute(dto);
    return this.issuedTokenPair(result);
  }

  private async issuedTokenPair(result: LoginOutput): Promise<TokenPair> {
    const payload = this.jwtPayload(result);
    const tokens = this.signedTokenPair(payload);
    await this.userRepository.saveRefreshToken(
      result.userId,
      tokens.refreshToken,
      getRefreshTokenExpiresAt(),
    );
    return tokens;
  }

  private jwtPayload(result: LoginOutput): JwtPayload {
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
