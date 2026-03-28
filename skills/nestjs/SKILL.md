---
name: nestjs
description: >
  NestJS modular architecture patterns for this SaaS platform.
  Trigger: When creating NestJS modules, controllers, services, guards, interceptors, pipes, or providers.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: '1.0'
  scope:
    [
      api-gateway,
      admin-gateway,
      auth-service,
      club-service,
      inventory-service,
      booking-service,
      finance-service,
    ]
  auto_invoke: 'Creating NestJS modules, guards, interceptors, pipes'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## Project Structure (DDD + Hexagonal)

```
apps/your-app/src/
├── app/
│   └── your-resource/
│       ├── controllers/          # One file per HTTP action
│       │   ├── resource-create.controller.ts
│       │   └── resource-get.controller.ts
│       ├── services/             # Orchestration only
│       ├── providers/            # NestJS DI wrappers (use-case inheritance)
│       ├── dtos/                 # Zod schemas + nestjs-zod DTOs
│       ├── helpers/              # Pure functions extracted from services
│       │   ├── index.ts          # Barrel export
│       │   ├── validation.helpers.ts
│       │   └── response.mapper.ts
│       ├── core/                 # Constants, injection tokens
│       └── your-resource.module.ts
├── core/                         # Global filters, guards, interceptors
└── main.ts
```

---

## One Controller Per Action (MANDATORY)

Each HTTP operation gets its own controller file.

```typescript
// resource-create.controller.ts
@ApiTags('Resources')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('resources')
export class ResourceCreateController {
  constructor(private readonly useCase: ResourceCreateProvider) {}

  @Post()
  @ApiOperation({ summary: 'Create a new resource' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateResourceDto): Promise<ResourceResponseDto> {
    const result = await this.useCase.run(dto);
    return { data: result, message: 'Created successfully' };
  }
}
```

Controllers must **only**:

- Validate input via Zod DTOs (through `ZodValidationPipe`)
- Call the corresponding use case or service
- Return the response

Controllers must **NEVER** contain business logic or infrastructure access.

---

## Provider Pattern (Service Wrapper with Inheritance)

NestJS providers extend pure use cases to integrate with the DI container.

```typescript
// 1. Pure use case (zero framework dependencies)
export class ResourceCreate {
  constructor(
    private readonly repository: ResourceRepository,
    private readonly externalService: ExternalService,
  ) {}

  async run(input: CreateInput): Promise<ResourcePrimitives> {
    const validated = this.validatedInput(input);
    const result = await this.externalService.execute(validated);
    const entity = Resource.create(this.entityData(validated, result));
    await this.repository.add(entity);
    return entity.toPrimitives();
  }
}

// 2. NestJS Provider (inherits from use case)
@Injectable()
export class ResourceCreateProvider extends ResourceCreate {
  constructor(
    @Inject(RESOURCE_REPOSITORY_TOKEN) repository: ResourceRepository,
    @Inject(EXTERNAL_SERVICE_TOKEN) externalService: ExternalService,
  ) {
    super(repository, externalService);
  }
}
```

---

## Multi-Tier Use Case Pattern (for complex orchestration)

```typescript
// Domain Use Case — pure business logic
export class ResourceCreateDomain {
  constructor(
    private readonly repository: ResourceRepository,
    private readonly billing: BillingService
  ) {}

  async run(input: DomainInput): Promise<ResourcePrimitives> { ... }
}

// Orchestration Use Case — coordinates multiple services
export class ResourceCreateOrchestrated {
  constructor(
    private readonly domainUseCase: ResourceCreateDomain,
    private readonly enrichmentService: EnrichmentService
  ) {}

  async run(input: OrchestratedInput): Promise<ResourcePrimitives> {
    const enriched = await this.enrichedData(input);
    return this.domainUseCase.run(this.domainInput(input, enriched));
  }
}

// NestJS Provider
@Injectable()
export class ResourceCreateOrchestratedProvider extends ResourceCreateOrchestrated {
  constructor(
    @Inject(RESOURCE_REPOSITORY_TOKEN) repository: ResourceRepository,
    @Inject(BILLING_TOKEN) billing: BillingService,
    @Inject(ENRICHMENT_TOKEN) enrichment: EnrichmentService
  ) {
    const domainUseCase = new ResourceCreateDomain(repository, billing);
    super(domainUseCase, enrichment);
  }
}
```

---

## DTOs with Zod + nestjs-zod (MANDATORY)

```typescript
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod/v4';

const CreateResourceSchema = z.object({
  name: z.string().min(1, { error: 'Name is required' }),
  amount: z.number().positive({ error: 'Amount must be positive' }),
  tags: z.array(z.string()).optional(),
});

export class CreateResourceDto extends createZodDto(CreateResourceSchema) {}

// Output DTO — simple interface, no class needed
export interface ResourceResponseDto {
  readonly data: ResourcePrimitives;
  readonly message: string;
}
```

Register `ZodValidationPipe` globally in `main.ts`:

```typescript
app.useGlobalPipes(new ZodValidationPipe());
```

---

## Injection Tokens (MANDATORY for interfaces)

```typescript
// resource.tokens.ts — centralize all tokens per resource
export const RESOURCE_REPOSITORY_TOKEN = Symbol('RESOURCE_REPOSITORY_TOKEN');
export const RESOURCE_EXTERNAL_SERVICE_TOKEN = Symbol(
  'RESOURCE_EXTERNAL_SERVICE_TOKEN',
);
```

---

## Module Configuration

```typescript
@Module({
  controllers: [
    ResourceCreateController,
    ResourceGetController,
    ResourceUpdateController,
    ResourceDeleteController,
  ],
  providers: [
    { provide: RESOURCE_REPOSITORY_TOKEN, useClass: PrismaResourceRepository },
    ResourceCreateProvider,
    ResourceGetProvider,
    ResourceUpdateProvider,
    ResourceDeleteProvider,
  ],
  exports: [RESOURCE_REPOSITORY_TOKEN],
})
export class ResourceModule {}
```

---

## Circular Dependency Prevention (CRITICAL)

Circular deps cause slow bootstrapping, DI instability, and startup bugs.

**❌ Never do this:**

```typescript
// ModuleA imports ModuleB
// ModuleB imports ModuleA  ← CIRCULAR
```

**✅ Solutions:**

1. Extract shared services into a `CoreModule`

```typescript
@Module({
  providers: [JwtService, ConfigService],
  exports: [JwtService, ConfigService],
})
export class CoreModule {}
```

2. Split modules by **responsibility**, not by feature
3. Use interface-based injection tokens (never concrete class references)

**Never use `forwardRef()`** — it's a band-aid. Restructure instead.

**Performance impact of fixing circular deps:**

- Bootstrap time: 40%+ faster cold starts
- Memory usage: reduced module retention
- Debugging: cleaner error traces

---

## Helpers Pattern (MANDATORY when > 150 lines)

When services or providers exceed 150–200 lines, extract to `helpers/`.

```
your-resource/
├── services/
│   └── resource.service.ts        # ~100 lines — orchestration only
├── helpers/
│   ├── index.ts                   # barrel export
│   ├── validation.helpers.ts      # pure validation functions
│   ├── request.builder.ts         # external API request shapes
│   └── response.mapper.ts         # API response → domain model
└── dtos/
```

Helpers characteristics:

- **Pure functions** — no side effects, no DI
- **Single responsibility**
- **Declarative names** (describe output, not process)
- **Independently testable** without mocks

```typescript
// response.mapper.ts
export function domainResourceFromResponse(
  response: ExternalAPIResponse,
): ResourceInput {
  return {
    id: response.resourceId,
    name: response.displayName,
    status: response.currentState,
  };
}

// index.ts (barrel)
export { domainResourceFromResponse } from './response.mapper';
export { validatedResourcePayload } from './validation.helpers';
```

---

## Security Patterns

```typescript
// Always validate webhook signatures with timing-safe comparison
import { timingSafeEqual } from 'crypto';

private isValidSecret(received: string, expected: string): boolean {
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
```

- Validate all inputs at the HTTP boundary with Zod + `nestjs-zod`
- Use `JwtAuthGuard` on all authenticated routes
- Never log sensitive data (tokens, passwords, personal IDs)
- Never trust `@Body()` without a Zod DTO

---

## HTTP Status Codes

| Code | Use for                            |
| ---- | ---------------------------------- |
| 200  | Successful GET/PUT/PATCH           |
| 201  | Successful POST that creates       |
| 204  | Successful DELETE                  |
| 400  | Validation failure                 |
| 401  | Missing/invalid auth token         |
| 403  | Authenticated but not authorized   |
| 404  | Resource does not exist            |
| 409  | State conflict (duplicate, locked) |
| 422  | Semantic validation failure        |
| 500  | Unexpected system failure          |
