import {
  DOMAIN_ERROR_TYPE,
  DomainError,
  DomainErrorCode,
  DomainErrorContext,
} from './domain-error';

export class BusinessRuleViolationError extends DomainError {
  readonly code: DomainErrorCode = DOMAIN_ERROR_TYPE.BUSINESS_RULE_VIOLATION;
  readonly title = 'Business Rule Violation';

  constructor({
    message,
    context = {},
  }: {
    message: string;
    context?: DomainErrorContext;
  }) {
    super({ context });
    this.message = message;
  }
}
