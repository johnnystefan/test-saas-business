export const DOMAIN_ERROR_TYPE = {
  VALIDATION: 'VALIDATION',
  INVALID_ARGUMENT: 'INVALID_ARGUMENT',
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
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
