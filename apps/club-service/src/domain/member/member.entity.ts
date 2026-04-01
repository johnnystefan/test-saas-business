import type { MemberStatus as MemberStatusType } from '@saas/shared-types';
import { TenantId } from '../business-unit/value-objects/tenant-id';
import { MemberId } from './value-objects/member-id';
import { MemberEmail } from './value-objects/member-email';
import { MemberName } from './value-objects/member-name';
import { MemberPhone } from './value-objects/member-phone';
import { MemberStatus } from './value-objects/member-status.vo';

export interface MemberPrimitives {
  readonly id: string;
  readonly tenantId: string;
  readonly name: string;
  readonly email: string | null;
  readonly phone: string | null;
  readonly status: MemberStatusType;
  readonly enrolledAt: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type CreateMemberData = {
  readonly tenantId: string;
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
};

export class Member {
  private constructor(
    public readonly id: MemberId,
    public readonly tenantId: TenantId,
    public name: MemberName,
    public email: MemberEmail | null,
    public phone: MemberPhone | null,
    public status: MemberStatus,
    public readonly enrolledAt: Date,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(params: CreateMemberData): Member {
    const now = new Date();
    return new Member(
      MemberId.generate(),
      TenantId.create(params.tenantId),
      MemberName.create(params.name),
      params.email != null ? MemberEmail.create(params.email) : null,
      params.phone != null ? MemberPhone.create(params.phone) : null,
      MemberStatus.active(),
      now,
      now,
      now,
    );
  }

  static fromPrimitives(primitives: MemberPrimitives): Member {
    return new Member(
      MemberId.create(primitives.id),
      TenantId.create(primitives.tenantId),
      MemberName.create(primitives.name),
      primitives.email != null ? MemberEmail.create(primitives.email) : null,
      primitives.phone != null ? MemberPhone.create(primitives.phone) : null,
      MemberStatus.create(primitives.status),
      primitives.enrolledAt,
      primitives.createdAt,
      primitives.updatedAt,
    );
  }

  toPrimitives(): MemberPrimitives {
    return {
      id: this.id.value,
      tenantId: this.tenantId.value,
      name: this.name.value,
      email: this.email?.value ?? null,
      phone: this.phone?.value ?? null,
      status: this.status.value,
      enrolledAt: this.enrolledAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
