import type { MemberStatus } from '@saas/shared-types';

export type Membership = {
  readonly id: string;
  readonly tenantId: string;
  readonly memberId: string;
  readonly businessUnitId: string;
  readonly status: MemberStatus;
  readonly startDate: Date;
  readonly endDate: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type CreateMembershipData = {
  readonly tenantId: string;
  readonly memberId: string;
  readonly businessUnitId: string;
  readonly startDate: Date;
};

export type MembershipWithMember = Membership & {
  readonly memberName: string;
  readonly memberEmail: string | null;
};
