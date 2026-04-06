import type { MemberStatus } from '@saas/shared-types';
import type {
  CreateMembershipData,
  Membership,
  MembershipWithMember,
} from './membership.entity';

export interface IMembershipRepository {
  create(data: CreateMembershipData): Promise<Membership>;
  findByMemberAndUnit(
    memberId: string,
    businessUnitId: string,
    tenantId: string,
  ): Promise<Membership | null>;
  findAllByBusinessUnit(
    businessUnitId: string,
    tenantId: string,
  ): Promise<MembershipWithMember[]>;
  findAllByMember(
    memberId: string,
    tenantId: string,
  ): Promise<MembershipWithMember[]>;
  updateStatus(
    id: string,
    tenantId: string,
    status: MemberStatus,
  ): Promise<Membership | null>;
}
