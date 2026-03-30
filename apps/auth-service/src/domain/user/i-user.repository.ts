import type { CreateUserData, RefreshToken, User } from './user.entity';

export interface IUserRepository {
  findByEmail(email: string, tenantId: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  saveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void>;
  findRefreshToken(token: string): Promise<RefreshToken | null>;
  revokeRefreshToken(token: string): Promise<void>;
}
