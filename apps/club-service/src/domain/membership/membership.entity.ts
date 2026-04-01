import type { MemberStatus as MemberStatusType } from '@saas/shared-types';
import { TenantId } from '../business-unit/value-objects/tenant-id';
import { MembershipId } from './value-objects/membership-id';
import { MembershipStatus } from './value-objects/membership-status.vo';
import { MemberRef } from './value-objects/member-ref';
import { BusinessUnitRef } from './value-objects/business-unit-ref';

export interface MembershipPrimitives {
  readonly id: string;
  readonly tenantId: string;
  readonly memberId: string;
  readonly businessUnitId: string;
  readonly status: MemberStatusType;
  readonly startDate: Date;
  readonly endDate: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type CreateMembershipData = {
  readonly tenantId: string;
  readonly memberId: string;
  readonly businessUnitId: string;
  readonly startDate: Date;
};

export class Membership {
  private constructor(
    public readonly id: MembershipId,
    public readonly tenantId: TenantId,
    public readonly memberId: MemberRef,
    public readonly businessUnitId: BusinessUnitRef,
    public status: MembershipStatus,
    public readonly startDate: Date,
    public endDate: Date | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(params: CreateMembershipData): Membership {
    const now = new Date();
    return new Membership(
      MembershipId.generate(),
      TenantId.create(params.tenantId),
      MemberRef.create(params.memberId),
      BusinessUnitRef.create(params.businessUnitId),
      MembershipStatus.active(),
      params.startDate,
      null,
      now,
      now,
    );
  }

  static fromPrimitives(primitives: MembershipPrimitives): Membership {
    return new Membership(
      MembershipId.create(primitives.id),
      TenantId.create(primitives.tenantId),
      MemberRef.create(primitives.memberId),
      BusinessUnitRef.create(primitives.businessUnitId),
      MembershipStatus.create(primitives.status),
      primitives.startDate,
      primitives.endDate,
      primitives.createdAt,
      primitives.updatedAt,
    );
  }

  toPrimitives(): MembershipPrimitives {
    return {
      id: this.id.value,
      tenantId: this.tenantId.value,
      memberId: this.memberId.value,
      businessUnitId: this.businessUnitId.value,
      status: this.status.value,
      startDate: this.startDate,
      endDate: this.endDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

// Kept for backward compat — consumers that need the enriched view
export type MembershipWithMember = MembershipPrimitives & {
  readonly memberName: string;
  readonly memberEmail: string | null;
};
