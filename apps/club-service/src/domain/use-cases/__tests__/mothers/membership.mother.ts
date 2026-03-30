import type {
  Membership,
  MembershipWithMember,
} from '../../../membership/membership.entity';

export class MembershipMother {
  static active(overrides?: Partial<Membership>): Membership {
    return {
      id: 'membership-1',
      tenantId: 'tenant-1',
      memberId: 'member-1',
      businessUnitId: 'unit-1',
      status: 'ACTIVE',
      startDate: new Date('2026-01-01'),
      endDate: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      ...overrides,
    };
  }

  static suspended(overrides?: Partial<Membership>): Membership {
    return this.active({ status: 'SUSPENDED', ...overrides });
  }

  static inactive(overrides?: Partial<Membership>): Membership {
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
      ...this.active(),
      memberName: 'John Doe',
      memberEmail: 'john@example.com',
      ...overrides,
    };
  }
}
