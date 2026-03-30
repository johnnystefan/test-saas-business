import { z } from 'zod/v4';
import {
  DOMAIN_ERROR_TYPE,
  DomainError,
  type DomainErrorCode,
} from './domain-error';

export class DomainValidationError extends DomainError {
  override readonly code: DomainErrorCode = DOMAIN_ERROR_TYPE.VALIDATION_ERROR;
  override readonly title = 'Validation Error';
  override readonly message: string;

  constructor({
    message,
    context = {},
  }: {
    readonly message: string;
    readonly context?: Record<string, unknown>;
  }) {
    super({ context });
    this.message = message;
  }

  static fromZod(zodError: z.ZodError): DomainValidationError {
    return new DomainValidationError({
      message: zodError.message,
      context: { issues: zodError.issues },
    });
  }
}
