// Matches club.proto messages

export interface GrpcCreateBusinessUnitRequest {
  readonly tenant_id: string;
  readonly name: string;
  readonly type: string;
}

export interface GrpcUpdateBusinessUnitRequest {
  readonly id: string;
  readonly tenant_id: string;
  readonly name: string;
  readonly is_active: boolean;
}

export interface GrpcListBusinessUnitsRequest {
  readonly tenant_id: string;
}

export interface GrpcListBusinessUnitsResponse {
  readonly items: readonly GrpcBusinessUnitResponse[];
}

export interface GrpcBusinessUnitResponse {
  readonly id: string;
  readonly tenant_id: string;
  readonly name: string;
  readonly type: string;
  readonly is_active: boolean;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface GrpcRegisterMemberRequest {
  readonly tenant_id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
}

export interface GrpcEnrollMemberRequest {
  readonly tenant_id: string;
  readonly member_id: string;
  readonly business_unit_id: string;
  readonly start_date: string;
  readonly end_date: string;
}

export interface GrpcListMembersRequest {
  readonly tenant_id: string;
}

export interface GrpcListMembersResponse {
  readonly items: readonly GrpcMemberResponse[];
}

export interface GrpcMemberResponse {
  readonly id: string;
  readonly tenant_id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly status: string;
  readonly enrolled_at: string;
}

export interface GrpcListMembershipsRequest {
  readonly tenant_id: string;
  readonly member_id: string;
  readonly email: string;
}

export interface GrpcListMembershipsResponse {
  readonly items: readonly GrpcMembershipResponse[];
}

export interface GrpcMembershipResponse {
  readonly id: string;
  readonly tenant_id: string;
  readonly member_id: string;
  readonly business_unit_id: string;
  readonly status: string;
  readonly start_date: string;
  readonly end_date: string;
}

export interface GrpcUpdateMembershipRequest {
  readonly id: string;
  readonly tenant_id: string;
  readonly status: string;
  readonly end_date: string;
}
