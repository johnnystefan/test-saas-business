import { Injectable } from '@nestjs/common';
import { UserRoleSchema, UserStatusSchema } from '@saas/shared-types';
import type {
  CreateUserData,
  RefreshToken,
  User,
} from '../../domain/user/user.entity';
import type { IUserRepository } from '../../domain/user/i-user.repository';
import { PrismaService } from './prisma.service';

type PrismaUser = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  status: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
};

type PrismaRefreshToken = {
  id: string;
  token: string;
  userId: string;
  revokedAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
};

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string, tenantId: string): Promise<User | null> {
    const record = await this.prisma.user.findFirst({
      where: { email, tenantId },
    });
    return record ? this.userDomain(record) : null;
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record ? this.userDomain(record) : null;
  }

  async create(data: CreateUserData): Promise<User> {
    const record = await this.prisma.user.create({ data });
    return this.userDomain(record);
  }

  async saveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    const record = await this.prisma.refreshToken.findUnique({
      where: { token },
    });
    return record ? this.refreshTokenDomain(record) : null;
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { token },
      data: { revokedAt: new Date() },
    });
  }

  private userDomain(record: PrismaUser): User {
    return {
      id: record.id,
      email: record.email,
      passwordHash: record.passwordHash,
      name: record.name,
      role: UserRoleSchema.parse(record.role),
      status: UserStatusSchema.parse(record.status),
      tenantId: record.tenantId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private refreshTokenDomain(record: PrismaRefreshToken): RefreshToken {
    return {
      id: record.id,
      token: record.token,
      userId: record.userId,
      revokedAt: record.revokedAt,
      expiresAt: record.expiresAt,
      createdAt: record.createdAt,
    };
  }
}
