import type { Member } from '../../../member/member.entity';

export class MemberMother {
  static active(overrides?: Partial<Member>): Member {
    return {
      id: 'member-1',
      tenantId: 'tenant-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: null,
      status: 'ACTIVE',
      enrolledAt: new Date('2026-01-01'),
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      ...overrides,
    };
  }

  static inactive(overrides?: Partial<Member>): Member {
    return this.active({ status: 'INACTIVE', ...overrides });
  }

  static suspended(overrides?: Partial<Member>): Member {
    return this.active({ status: 'SUSPENDED', ...overrides });
  }

  static withoutEmail(overrides?: Partial<Member>): Member {
    return this.active({ email: null, ...overrides });
  }
}
