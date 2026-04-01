import type {
  GrpcBusinessUnitResponse,
  GrpcMemberResponse,
  GrpcMembershipResponse,
} from '@saas/grpc';
import type { BusinessUnit } from '../domain/business-unit/business-unit.entity';
import type { Member } from '../domain/member/member.entity';
import type {
  Membership,
  MembershipWithMember,
} from '../domain/membership/membership.entity';

export function mapBusinessUnit(unit: BusinessUnit): GrpcBusinessUnitResponse {
  const p = unit.toPrimitives();
  return {
    id: p.id,
    tenant_id: p.tenantId,
    name: p.name,
    type: p.type,
    is_active: p.isActive,
    created_at: p.createdAt.toISOString(),
    updated_at: p.updatedAt.toISOString(),
  };
}

export function mapMember(member: Member): GrpcMemberResponse {
  const p = member.toPrimitives();
  return {
    id: p.id,
    tenant_id: p.tenantId,
    name: p.name,
    email: p.email ?? '',
    phone: p.phone ?? '',
    status: p.status,
    enrolled_at: p.enrolledAt.toISOString(),
  };
}

export function mapMembership(membership: Membership): GrpcMembershipResponse {
  const p = membership.toPrimitives();
  return {
    id: p.id,
    tenant_id: p.tenantId,
    member_id: p.memberId,
    business_unit_id: p.businessUnitId,
    status: p.status,
    start_date: p.startDate.toISOString(),
    end_date: p.endDate?.toISOString() ?? '',
  };
}

export function mapMembershipWithMember(
  membership: MembershipWithMember,
): GrpcMembershipResponse {
  return {
    id: membership.id,
    tenant_id: membership.tenantId,
    member_id: membership.memberId,
    business_unit_id: membership.businessUnitId,
    status: membership.status,
    start_date: membership.startDate.toISOString(),
    end_date: membership.endDate?.toISOString() ?? '',
  };
}
