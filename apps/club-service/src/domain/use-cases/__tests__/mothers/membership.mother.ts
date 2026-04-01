import {
  Membership,
  type MembershipPrimitives,
  type MembershipWithMember,
} from '../../../membership/membership.entity';

export class MembershipMother {
  static active(overrides?: Partial<MembershipPrimitives>): Membership {
    return Membership.fromPrimitives({
      id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      tenantId: 'tenant-1',
      memberId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      businessUnitId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      status: 'ACTIVE',
      startDate: new Date('2026-01-01'),
      endDate: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      ...overrides,
    });
  }

  static suspended(overrides?: Partial<MembershipPrimitives>): Membership {
    return this.active({ status: 'SUSPENDED', ...overrides });
  }

  static inactive(overrides?: Partial<MembershipPrimitives>): Membership {
    return this.active({
      status: 'INACTIVE',
      endDate: new Date('2026-06-01'),
      ...overrides,
    });
  }

  static withMember(
    overrides?: Partial<MembershipWithMember>,
  ): MembershipWithMember {
    return {
      ...this.active().toPrimitives(),
      memberName: 'John Doe',
      memberEmail: 'john@example.com',
      ...overrides,
    };
  }
}
