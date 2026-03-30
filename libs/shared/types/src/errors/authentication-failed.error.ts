import {
  DOMAIN_ERROR_TYPE,
  DomainError,
  type DomainErrorCode,
  type DomainErrorContext,
} from './domain-error';

export class AuthenticationFailedError extends DomainError {
  override readonly code: DomainErrorCode =
    DOMAIN_ERROR_TYPE.AUTH_AUTHENTICATION_FAILED;
  override readonly title = 'Authentication Failed';
  override readonly message: string;

  constructor({
    reason,
    context = {},
  }: {
    readonly reason: string;
    readonly context?: DomainErrorContext;
  }) {
    super({ context: { reason, ...context } });
    this.message = `Authentication failed: ${reason}`;
  }
}
