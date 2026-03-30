import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type { Observable } from 'rxjs';
import { GRPC_CLUB_SERVICE } from '@saas/grpc';
import type {
  GrpcCreateBusinessUnitRequest,
  GrpcBusinessUnitResponse,
  GrpcListBusinessUnitsRequest,
  GrpcListBusinessUnitsResponse,
  GrpcUpdateBusinessUnitRequest,
  GrpcRegisterMemberRequest,
  GrpcMemberResponse,
  GrpcEnrollMemberRequest,
  GrpcMembershipResponse,
  GrpcListMembersRequest,
  GrpcListMembersResponse,
  GrpcListMembershipsRequest,
  GrpcListMembershipsResponse,
  GrpcUpdateMembershipRequest,
} from '@saas/grpc';

interface ClubServiceGrpcClient {
  createBusinessUnit(
    data: GrpcCreateBusinessUnitRequest,
  ): Observable<GrpcBusinessUnitResponse>;
  listBusinessUnits(
    data: GrpcListBusinessUnitsRequest,
  ): Observable<GrpcListBusinessUnitsResponse>;
  updateBusinessUnit(
    data: GrpcUpdateBusinessUnitRequest,
  ): Observable<GrpcBusinessUnitResponse>;
  registerMember(
    data: GrpcRegisterMemberRequest,
  ): Observable<GrpcMemberResponse>;
  enrollMember(
    data: GrpcEnrollMemberRequest,
  ): Observable<GrpcMembershipResponse>;
  listMembers(
    data: GrpcListMembersRequest,
  ): Observable<GrpcListMembersResponse>;
  listMemberships(
    data: GrpcListMembershipsRequest,
  ): Observable<GrpcListMembershipsResponse>;
  updateMembership(
    data: GrpcUpdateMembershipRequest,
  ): Observable<GrpcMembershipResponse>;
}

@Injectable()
export class ClubGrpcService implements OnModuleInit {
  private readonly logger = new Logger(ClubGrpcService.name);
  private clubService!: ClubServiceGrpcClient;

  constructor(@Inject(GRPC_CLUB_SERVICE) private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.clubService =
      this.client.getService<ClubServiceGrpcClient>('ClubService');
    this.logger.log('ClubGrpcService initialized');
  }

  async createBusinessUnit(
    data: GrpcCreateBusinessUnitRequest,
  ): Promise<GrpcBusinessUnitResponse> {
    return firstValueFrom(this.clubService.createBusinessUnit(data));
  }

  async listBusinessUnits(
    data: GrpcListBusinessUnitsRequest,
  ): Promise<GrpcListBusinessUnitsResponse> {
    return firstValueFrom(this.clubService.listBusinessUnits(data));
  }

  async updateBusinessUnit(
    data: GrpcUpdateBusinessUnitRequest,
  ): Promise<GrpcBusinessUnitResponse> {
    return firstValueFrom(this.clubService.updateBusinessUnit(data));
  }

  async registerMember(
    data: GrpcRegisterMemberRequest,
  ): Promise<GrpcMemberResponse> {
    return firstValueFrom(this.clubService.registerMember(data));
  }

  async enrollMember(
    data: GrpcEnrollMemberRequest,
  ): Promise<GrpcMembershipResponse> {
    return firstValueFrom(this.clubService.enrollMember(data));
  }

  async listMembers(
    data: GrpcListMembersRequest,
  ): Promise<GrpcListMembersResponse> {
    return firstValueFrom(this.clubService.listMembers(data));
  }

  async listMemberships(
    data: GrpcListMembershipsRequest,
  ): Promise<GrpcListMembershipsResponse> {
    return firstValueFrom(this.clubService.listMemberships(data));
  }

  async updateMembership(
    data: GrpcUpdateMembershipRequest,
  ): Promise<GrpcMembershipResponse> {
    return firstValueFrom(this.clubService.updateMembership(data));
  }
}
