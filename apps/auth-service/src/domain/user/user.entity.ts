import type { UserRole, UserStatus } from '@saas/shared-types';

export type User = {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly name: string;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly tenantId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type CreateUserData = {
  readonly email: string;
  readonly passwordHash: string;
  readonly name: string;
  readonly role: UserRole;
  readonly tenantId: string;
};

export type RefreshToken = {
  readonly id: string;
  readonly token: string;
  readonly userId: string;
  readonly revokedAt: Date | null;
  readonly expiresAt: Date;
  readonly createdAt: Date;
};
