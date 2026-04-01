import { Member, type MemberPrimitives } from '../../../member/member.entity';

export class MemberMother {
  static active(overrides?: Partial<MemberPrimitives>): Member {
    return Member.fromPrimitives({
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      tenantId: 'tenant-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: null,
      status: 'ACTIVE',
      enrolledAt: new Date('2026-01-01'),
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      ...overrides,
    });
  }

  static inactive(overrides?: Partial<MemberPrimitives>): Member {
    return this.active({ status: 'INACTIVE', ...overrides });
  }

  static suspended(overrides?: Partial<MemberPrimitives>): Member {
    return this.active({ status: 'SUSPENDED', ...overrides });
  }

  static withoutEmail(overrides?: Partial<MemberPrimitives>): Member {
    return this.active({ email: null, ...overrides });
  }
}
