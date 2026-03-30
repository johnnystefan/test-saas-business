// Matches auth.proto UserPayload message
export interface GrpcUserPayload {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: string;
  readonly tenant_id: string;
}

export interface GrpcRegisterRequest {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly tenant_id: string;
  readonly role: string;
}

export interface GrpcRegisterResponse {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: string;
  readonly tenant_id: string;
}

export interface GrpcLoginRequest {
  readonly email: string;
  readonly password: string;
  readonly tenant_id: string;
}

export interface GrpcLoginResponse {
  readonly access_token: string;
  readonly refresh_token: string;
  readonly user: GrpcUserPayload;
}

export interface GrpcRefreshRequest {
  readonly refresh_token: string;
}

export interface GrpcRefreshResponse {
  readonly access_token: string;
  readonly refresh_token: string;
}

export interface GrpcLogoutRequest {
  readonly refresh_token: string;
}

export interface GrpcLogoutResponse {
  readonly success: boolean;
}

export interface GrpcValidateTokenRequest {
  readonly token: string;
}

export interface GrpcValidateTokenResponse {
  readonly valid: boolean;
  readonly user: GrpcUserPayload;
}
