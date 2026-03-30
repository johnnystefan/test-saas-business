import type { Observable } from 'rxjs';

// Shape returned by @nestjs/microservices gRPC client methods
export type GrpcUnaryCall<TRequest, TResponse> = (
  data: TRequest,
) => Observable<TResponse>;

// Service token names used for DI
export const GRPC_AUTH_SERVICE = 'AUTH_SERVICE' as const;
export const GRPC_CLUB_SERVICE = 'CLUB_SERVICE' as const;
export const GRPC_BOOKING_SERVICE = 'BOOKING_SERVICE' as const;
export const GRPC_FINANCE_SERVICE = 'FINANCE_SERVICE' as const;
export const GRPC_INVENTORY_SERVICE = 'INVENTORY_SERVICE' as const;

// gRPC port assignments (separate from HTTP ports)
export const GRPC_PORTS = {
  AUTH: 5001,
  CLUB: 5002,
  BOOKING: 5003,
  FINANCE: 5004,
  INVENTORY: 5005,
} as const;
