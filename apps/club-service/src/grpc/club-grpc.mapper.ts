import type {
  GrpcBusinessUnitResponse,
  GrpcMemberResponse,
  GrpcMembershipResponse,
} from '@saas/grpc';
import type { BusinessUnit } from '../domain/business-unit/business-unit.entity';
import type { Member } from '../domain/member/member.entity';
import type { Membership } from '../domain/membership/membership.entity';

export function mapBusinessUnit(unit: BusinessUnit): GrpcBusinessUnitResponse {
  return {
    id: unit.id,
    tenant_id: unit.tenantId,
    name: unit.name,
    type: unit.type,
    is_active: unit.isActive,
    created_at: unit.createdAt.toISOString(),
    updated_at: unit.updatedAt.toISOString(),
  };
}

export function mapMember(member: Member): GrpcMemberResponse {
  return {
    id: member.id,
    tenant_id: member.tenantId,
    name: member.name,
    email: member.email ?? '',
    phone: member.phone ?? '',
    status: member.status,
    enrolled_at: member.enrolledAt.toISOString(),
  };
}

export function mapMembership(membership: Membership): GrpcMembershipResponse {
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
