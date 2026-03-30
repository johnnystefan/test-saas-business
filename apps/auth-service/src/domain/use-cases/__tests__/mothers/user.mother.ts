import type { User } from '../../../user/user.entity';

export class UserMother {
  static active(overrides?: Partial<User>): User {
    return {
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: '$2a$10$hashed',
      name: 'Test User',
      role: 'MEMBER',
      status: 'ACTIVE',
      tenantId: 'tenant-1',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      ...overrides,
    };
  }

  static inactive(overrides?: Partial<User>): User {
    return this.active({ status: 'INACTIVE', ...overrides });
  }

  static tenantAdmin(overrides?: Partial<User>): User {
    return this.active({ role: 'TENANT_ADMIN', ...overrides });
  }

  static staff(overrides?: Partial<User>): User {
    return this.active({ role: 'STAFF', ...overrides });
  }
}
