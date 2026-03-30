import type { IUserRepository } from '../user/i-user.repository';

export type LogoutInput = {
  readonly refreshToken: string;
};

export class LogoutUseCase {
  constructor(protected readonly userRepository: IUserRepository) {}

  async execute(input: LogoutInput): Promise<void> {
    const storedToken = await this.userRepository.findRefreshToken(
      input.refreshToken,
    );
    if (!storedToken) {
      // Idempotent: if token doesn't exist, logout is already effective
      return;
    }

    if (storedToken.revokedAt !== null) {
      // Already revoked — no-op
      return;
    }

    await this.userRepository.revokeRefreshToken(input.refreshToken);
  }
}
