import {
  DOMAIN_ERROR_TYPE,
  DomainError,
  type DomainErrorCode,
  type DomainErrorContext,
} from './domain-error';

export class InvalidArgumentError extends DomainError {
  override readonly code: DomainErrorCode = DOMAIN_ERROR_TYPE.INVALID_ARGUMENT;
  override readonly title = 'Invalid Argument';
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
