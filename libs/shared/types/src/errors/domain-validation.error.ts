import { z } from 'zod/v4';
import {
  DOMAIN_ERROR_TYPE,
  DomainError,
  DomainErrorCode,
} from './domain-error';

export class DomainValidationError extends DomainError {
  readonly code: DomainErrorCode = DOMAIN_ERROR_TYPE.VALIDATION;
  readonly title = 'Validation Error';

  constructor({
    message,
    context = {},
  }: {
    message: string;
    context?: Record<string, unknown>;
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
