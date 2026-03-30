import {
  DOMAIN_ERROR_TYPE,
  DomainError,
  type DomainErrorCode,
  type DomainErrorContext,
} from './domain-error';

export class ResourceAlreadyExistsError extends DomainError {
  override readonly code: DomainErrorCode =
    DOMAIN_ERROR_TYPE.RESOURCE_ALREADY_EXISTS;
  override readonly title = 'Resource Already Exists';
  override readonly message: string;

  constructor({
    resource,
    field,
    value,
    context = {},
  }: {
    readonly resource: string;
    readonly field: string;
    readonly value: string;
    readonly context?: DomainErrorContext;
  }) {
    super({ context: { resource, field, value, ...context } });
    this.message = `${resource} already exists with ${field}: ${value}`;
  }
}
