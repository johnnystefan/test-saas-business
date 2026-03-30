import type { MemberStatus } from '@saas/shared-types';

export type Member = {
  readonly id: string;
  readonly tenantId: string;
  readonly name: string;
  readonly email: string | null;
  readonly phone: string | null;
  readonly status: MemberStatus;
  readonly enrolledAt: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type CreateMemberData = {
  readonly tenantId: string;
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
};
