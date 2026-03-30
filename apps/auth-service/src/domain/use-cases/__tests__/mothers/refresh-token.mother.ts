import type { RefreshToken } from '../../../user/user.entity';

export class RefreshTokenMother {
  static active(overrides?: Partial<RefreshToken>): RefreshToken {
    return {
      id: 'rt-1',
      token: 'valid-refresh-token',
      userId: 'user-1',
      revokedAt: null,
      expiresAt: new Date(Date.now() + 86400000),
      createdAt: new Date('2026-01-01'),
      ...overrides,
    };
  }

  static revoked(overrides?: Partial<RefreshToken>): RefreshToken {
    return this.active({ revokedAt: new Date('2026-01-01'), ...overrides });
  }

  static expired(overrides?: Partial<RefreshToken>): RefreshToken {
    return this.active({
      expiresAt: new Date(Date.now() - 1000),
      ...overrides,
    });
  }
}
