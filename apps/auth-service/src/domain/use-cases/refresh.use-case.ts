import { type UserRole, AuthenticationFailedError } from '@saas/shared-types';
import type { IUserRepository } from '../user/i-user.repository';
import type { RefreshToken, User } from '../user/user.entity';

export type RefreshInput = {
  readonly refreshToken: string;
};

export type RefreshOutput = {
  readonly userId: string;
  readonly email: string;
  readonly role: UserRole;
  readonly tenantId: string;
};

export class RefreshUseCase {
  constructor(protected readonly userRepository: IUserRepository) {}

  async execute(input: RefreshInput): Promise<RefreshOutput> {
    const token = await this.validRefreshToken(input.refreshToken);
    const user = await this.activeUserForToken(token);
    await this.userRepository.revokeRefreshToken(input.refreshToken);
    return this.refreshOutput(user);
  }

  private async validRefreshToken(token: string): Promise<RefreshToken> {
    const stored = await this.userRepository.findRefreshToken(token);
    if (!stored)
      throw new AuthenticationFailedError({
        reason: 'refresh token not found',
      });
    if (stored.revokedAt !== null)
      throw new AuthenticationFailedError({
        reason: 'refresh token has been revoked',
      });
    if (stored.expiresAt < new Date())
      throw new AuthenticationFailedError({
        reason: 'refresh token has expired',
      });
    return stored;
  }

  private async activeUserForToken(token: RefreshToken): Promise<User> {
    const user = await this.userRepository.findById(token.userId);
    if (!user)
      throw new AuthenticationFailedError({ reason: 'user not found' });
    if (user.status !== 'ACTIVE')
      throw new AuthenticationFailedError({ reason: 'user is inactive' });
    return user;
  }

  private refreshOutput(user: User): RefreshOutput {
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };
  }
}
