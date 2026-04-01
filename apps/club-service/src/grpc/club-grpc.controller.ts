import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import type {
  GrpcBusinessUnitResponse,
  GrpcCreateBusinessUnitRequest,
  GrpcEnrollMemberRequest,
  GrpcListBusinessUnitsRequest,
  GrpcListBusinessUnitsResponse,
  GrpcListMembersRequest,
  GrpcListMembersResponse,
  GrpcListMembershipsRequest,
  GrpcListMembershipsResponse,
  GrpcMemberResponse,
  GrpcMembershipResponse,
  GrpcRegisterMemberRequest,
  GrpcUpdateBusinessUnitRequest,
  GrpcUpdateMembershipRequest,
} from '@saas/grpc';
import type { BusinessUnitType, MemberStatus } from '@saas/shared-types';
import { CreateBusinessUnitProvider } from '../business-unit/providers/create-business-unit.provider';
import { ListBusinessUnitsProvider } from '../business-unit/providers/list-business-units.provider';
import { UpdateBusinessUnitProvider } from '../business-unit/providers/update-business-unit.provider';
import { RegisterMemberProvider } from '../member/providers/register-member.provider';
import { EnrollMemberProvider } from '../member/providers/enroll-member.provider';
import { ListMembersProvider } from '../member/providers/list-members.provider';
import { ListMembershipsProvider } from '../member/providers/list-memberships.provider';
import { UpdateMembershipProvider } from '../member/providers/update-membership.provider';
import {
  mapBusinessUnit,
  mapMember,
  mapMembership,
  mapMembershipWithMember,
} from './club-grpc.mapper';

@Controller()
export class ClubGrpcController {
  constructor(
    private readonly createBusinessUnitProvider: CreateBusinessUnitProvider,
    private readonly listBusinessUnitsProvider: ListBusinessUnitsProvider,
    private readonly updateBusinessUnitProvider: UpdateBusinessUnitProvider,
    private readonly registerMemberProvider: RegisterMemberProvider,
    private readonly enrollMemberProvider: EnrollMemberProvider,
    private readonly listMembersProvider: ListMembersProvider,
    private readonly listMembershipsProvider: ListMembershipsProvider,
    private readonly updateMembershipProvider: UpdateMembershipProvider,
  ) {}

  @GrpcMethod('ClubService', 'CreateBusinessUnit')
  async createBusinessUnit(
    data: GrpcCreateBusinessUnitRequest,
  ): Promise<GrpcBusinessUnitResponse> {
    const unit = await this.createBusinessUnitProvider.execute({
      tenantId: data.tenant_id,
      name: data.name,
      type: data.type as BusinessUnitType,
    });
    return mapBusinessUnit(unit);
  }

  @GrpcMethod('ClubService', 'ListBusinessUnits')
  async listBusinessUnits(
    data: GrpcListBusinessUnitsRequest,
  ): Promise<GrpcListBusinessUnitsResponse> {
    const units = await this.listBusinessUnitsProvider.execute(data.tenant_id);
    return { items: units.map(mapBusinessUnit) };
  }

  @GrpcMethod('ClubService', 'UpdateBusinessUnit')
  async updateBusinessUnit(
    data: GrpcUpdateBusinessUnitRequest,
  ): Promise<GrpcBusinessUnitResponse> {
    const unit = await this.updateBusinessUnitProvider.execute({
      id: data.id,
      tenantId: data.tenant_id,
      data: {
        name: data.name || undefined,
        isActive: data.is_active,
      },
    });
    return mapBusinessUnit(unit);
  }

  @GrpcMethod('ClubService', 'RegisterMember')
  async registerMember(
    data: GrpcRegisterMemberRequest,
  ): Promise<GrpcMemberResponse> {
    const member = await this.registerMemberProvider.execute({
      tenantId: data.tenant_id,
      name: data.name,
      email: data.email || undefined,
      phone: data.phone || undefined,
    });
    return mapMember(member);
  }

  @GrpcMethod('ClubService', 'EnrollMember')
  async enrollMember(
    data: GrpcEnrollMemberRequest,
  ): Promise<GrpcMembershipResponse> {
    const membership = await this.enrollMemberProvider.execute({
      tenantId: data.tenant_id,
      memberId: data.member_id,
      businessUnitId: data.business_unit_id,
      startDate: new Date(data.start_date),
    });
    return mapMembership(membership);
  }

  @GrpcMethod('ClubService', 'ListMembers')
  async listMembers(
    data: GrpcListMembersRequest,
  ): Promise<GrpcListMembersResponse> {
    const members = await this.listMembersProvider.execute(data.tenant_id);
    return { items: members.map(mapMember) };
  }

  @GrpcMethod('ClubService', 'ListMemberships')
  async listMemberships(
    data: GrpcListMembershipsRequest,
  ): Promise<GrpcListMembershipsResponse> {
    // NOTE: proto ListMembershipsRequest.member_id is mapped to businessUnitId
    // in the use case. See mapping-notes section in implementation summary.
    const memberships = await this.listMembershipsProvider.execute(
      data.member_id,
      data.tenant_id,
    );
    return { items: memberships.map(mapMembershipWithMember) };
  }

  @GrpcMethod('ClubService', 'UpdateMembership')
  async updateMembership(
    data: GrpcUpdateMembershipRequest,
  ): Promise<GrpcMembershipResponse> {
    const membership = await this.updateMembershipProvider.execute({
      id: data.id,
      tenantId: data.tenant_id,
      status: data.status as MemberStatus,
    });
    return mapMembership(membership);
  }
}
