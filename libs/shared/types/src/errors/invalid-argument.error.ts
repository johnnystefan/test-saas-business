import {
  DOMAIN_ERROR_TYPE,
  DomainError,
  DomainErrorCode,
  DomainErrorContext,
} from './domain-error';

export class InvalidArgumentError extends DomainError {
  readonly code: DomainErrorCode = DOMAIN_ERROR_TYPE.INVALID_ARGUMENT;
  readonly title = 'Invalid Argument';

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
