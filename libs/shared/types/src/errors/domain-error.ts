export const DOMAIN_ERROR_TYPE = {
  // Resource
  RESOURCE_NOT_FOUND: 'resource.not_found',
  RESOURCE_ALREADY_EXISTS: 'resource.already_exists',
  RESOURCE_CONFLICT: 'resource.conflict',

  // Business
  BUSINESS_RULE_VIOLATION: 'business.rule_violation',
  BUSINESS_OPERATION_NOT_ALLOWED: 'business.operation_not_allowed',

  // Validation
  VALIDATION_ERROR: 'validation.error',
  INVALID_ARGUMENT: 'invalid.argument',

  // Auth
  AUTH_AUTHENTICATION_FAILED: 'auth.authentication_failed',
  AUTH_ACCESS_DENIED: 'auth.access_denied',

  // External
  EXTERNAL_SERVICE_UNAVAILABLE: 'external.service_unavailable',
} as const;

export type DomainErrorCode =
  (typeof DOMAIN_ERROR_TYPE)[keyof typeof DOMAIN_ERROR_TYPE];

export type DomainErrorContext = Record<string, unknown>;

export abstract class DomainError extends Error {
  abstract readonly code: DomainErrorCode;
  abstract readonly title: string;
  readonly context: DomainErrorContext;

  constructor({ context = {} }: { context?: DomainErrorContext } = {}) {
    super();
    this.context = context;
    this.name = this.constructor.name;
  }
}
