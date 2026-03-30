import {
  DOMAIN_ERROR_TYPE,
  DomainError,
  type DomainErrorCode,
  type DomainErrorContext,
} from './domain-error';

export class ResourceNotFoundError extends DomainError {
  override readonly code: DomainErrorCode =
    DOMAIN_ERROR_TYPE.RESOURCE_NOT_FOUND;
  override readonly title = 'Resource Not Found';
  override readonly message: string;

  constructor({
    resource,
    id,
    context = {},
  }: {
    readonly resource: string;
    readonly id: string;
    readonly context?: DomainErrorContext;
  }) {
    super({ context: { resource, id, ...context } });
    this.message = `${resource} not found: ${id}`;
  }
}
