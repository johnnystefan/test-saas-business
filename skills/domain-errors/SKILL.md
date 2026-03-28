---
name: domain-errors
description: >
  DomainError patterns and error codes for this SaaS platform.
  Trigger: When creating domain-specific errors, handling business rule violations, or mapping errors to HTTP responses.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope:
    [
      auth-service,
      club-service,
      inventory-service,
      booking-service,
      finance-service,
      libs,
    ]
  auto_invoke: 'Working on domain models or business rules'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## DomainError Base Class

Define the base in `libs/shared/types/src/errors/`:

```typescript
// domain-error.ts
export const DOMAIN_ERROR_TYPE = {
  // Resource
  RESOURCE_NOT_FOUND: 'resource.not_found',
  RESOURCE_ALREADY_EXISTS: 'resource.already_exists',
  RESOURCE_CONFLICT: 'resource.conflict',
  RESOURCE_LOCKED: 'resource.locked',

  // Business
  BUSINESS_RULE_VIOLATION: 'business.rule_violation',
  BUSINESS_OPERATION_NOT_ALLOWED: 'business.operation_not_allowed',
  BUSINESS_INVALID_STATE_TRANSITION: 'business.invalid_state_transition',

  // External
  EXTERNAL_SERVICE_UNAVAILABLE: 'external.service_unavailable',
  EXTERNAL_INTEGRATION_FAILURE: 'external.integration_failure',
  EXTERNAL_TIMEOUT: 'external.timeout',

  // Validation
  VALIDATION_ERROR: 'validation.error',
  INVALID_ARGUMENT: 'invalid.argument',

  // Auth
  AUTH_AUTHENTICATION_FAILED: 'auth.authentication_failed',
  AUTH_ACCESS_DENIED: 'auth.access_denied',

  // System
  SYSTEM_CONFIGURATION_ERROR: 'system.configuration_error',
  SYSTEM_INFRASTRUCTURE_ERROR: 'system.infrastructure_error',
  SYSTEM_PERSISTENCE_ERROR: 'system.persistence_error',
} as const;

export type DomainErrorCode =
  (typeof DOMAIN_ERROR_TYPE)[keyof typeof DOMAIN_ERROR_TYPE];

export interface DomainErrorContext {
  readonly [key: string]: unknown;
}

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
```

---

## Concrete Domain Errors

```typescript
// resource-not-found.error.ts
import {
  DomainError,
  DOMAIN_ERROR_TYPE,
  type DomainErrorCode,
} from '@saas/shared-types';

export class ResourceNotFoundError extends DomainError {
  override readonly code: DomainErrorCode =
    DOMAIN_ERROR_TYPE.RESOURCE_NOT_FOUND;
  override readonly title = 'Resource Not Found';
  override readonly message: string;

  constructor(resourceId: string, cause?: unknown) {
    super({
      context: {
        resource: 'Resource',
        resourceId,
        cause: cause instanceof Error ? cause.message : cause,
      },
    });
    this.message = `Resource not found for ID: ${resourceId}`;
  }

  static create(resourceId: string, cause?: unknown): ResourceNotFoundError {
    return new ResourceNotFoundError(resourceId, cause);
  }
}

// business-rule-violation.error.ts
export class BusinessRuleViolationError extends DomainError {
  override readonly code: DomainErrorCode =
    DOMAIN_ERROR_TYPE.BUSINESS_RULE_VIOLATION;
  override readonly title = 'Business Rule Violation';
  override readonly message: string;

  constructor(rule: string, details?: string) {
    super({ context: { rule, details } });
    this.message = `Business rule violated: ${rule}${details ? ` — ${details}` : ''}`;
  }

  static create(rule: string, details?: string): BusinessRuleViolationError {
    return new BusinessRuleViolationError(rule, details);
  }
}

// invalid-argument.error.ts
export class InvalidArgumentError extends DomainError {
  override readonly code: DomainErrorCode = DOMAIN_ERROR_TYPE.INVALID_ARGUMENT;
  override readonly title = 'Invalid Argument';
  override readonly message: string;

  constructor(message: string) {
    super({ context: { message } });
    this.message = message;
  }
}
```

---

## Zod Validation Error

```typescript
// validation.error.ts
import { z } from 'zod/v4';

export class DomainValidationError extends DomainError {
  override readonly code: DomainErrorCode = DOMAIN_ERROR_TYPE.VALIDATION_ERROR;
  override readonly title = 'Validation Error';
  override readonly message: string;

  constructor(zodError: z.ZodError, input?: unknown) {
    super({
      context: {
        issues: zodError.issues,
        input,
      },
    });
    this.message = `Validation failed: ${zodError.issues.map((i) => i.message).join(', ')}`;
  }

  static fromZod(error: z.ZodError, input?: unknown): DomainValidationError {
    return new DomainValidationError(error, input);
  }
}
```

Usage with `safeParse`:

```typescript
// ✅ ALWAYS use safeParse — never parse() + try/catch
private validatedInput(data: unknown): CreateResourceInput {
  const result = CreateResourceSchema.safeParse(data);
  if (!result.success) {
    throw DomainValidationError.fromZod(result.error, data);
  }
  return result.data;
}
```

---

## NestJS Exception Filter

Map domain errors to HTTP responses automatically:

```typescript
// domain-error.filter.ts
@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = this.httpStatus(exception.code);

    response.status(status).json({
      statusCode: status,
      error: exception.title,
      message: exception.message,
      code: exception.code,
    });
  }

  private httpStatus(code: DomainErrorCode): number {
    const map: Partial<Record<DomainErrorCode, number>> = {
      [DOMAIN_ERROR_TYPE.RESOURCE_NOT_FOUND]: 404,
      [DOMAIN_ERROR_TYPE.RESOURCE_ALREADY_EXISTS]: 409,
      [DOMAIN_ERROR_TYPE.RESOURCE_CONFLICT]: 409,
      [DOMAIN_ERROR_TYPE.RESOURCE_LOCKED]: 423,
      [DOMAIN_ERROR_TYPE.BUSINESS_RULE_VIOLATION]: 422,
      [DOMAIN_ERROR_TYPE.BUSINESS_OPERATION_NOT_ALLOWED]: 403,
      [DOMAIN_ERROR_TYPE.VALIDATION_ERROR]: 400,
      [DOMAIN_ERROR_TYPE.INVALID_ARGUMENT]: 400,
      [DOMAIN_ERROR_TYPE.AUTH_AUTHENTICATION_FAILED]: 401,
      [DOMAIN_ERROR_TYPE.AUTH_ACCESS_DENIED]: 403,
      [DOMAIN_ERROR_TYPE.EXTERNAL_SERVICE_UNAVAILABLE]: 503,
      [DOMAIN_ERROR_TYPE.EXTERNAL_TIMEOUT]: 504,
    };
    return map[code] ?? 500;
  }
}
```

Register globally in `main.ts`:

```typescript
app.useGlobalFilters(new DomainErrorFilter());
```

---

## Error Location Rules

| Error type               | Location                                           |
| ------------------------ | -------------------------------------------------- |
| `DomainError` base class | `libs/shared/types/src/errors/domain-error.ts`     |
| Generic domain errors    | `libs/shared/types/src/errors/`                    |
| Domain-specific errors   | `apps/[service]/src/app/[resource]/domain/errors/` |
| Exception filter         | `apps/[service]/src/core/filters/`                 |
