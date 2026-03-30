import {
  DOMAIN_ERROR_TYPE,
  DomainError,
  type DomainErrorCode,
  type DomainErrorContext,
} from './domain-error';

export class BusinessRuleViolationError extends DomainError {
  override readonly code: DomainErrorCode =
    DOMAIN_ERROR_TYPE.BUSINESS_RULE_VIOLATION;
  override readonly title = 'Business Rule Violation';
  override readonly message: string;

  constructor({
    message,
    context = {},
  }: {
    readonly message: string;
    readonly context?: DomainErrorContext;
  }) {
    super({ context });
    this.message = message;
  }
}
