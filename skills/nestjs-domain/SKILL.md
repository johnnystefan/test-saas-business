---
name: nestjs-domain
description: >
  Domain layer patterns (DDD) for NestJS services in this SaaS platform.
  Trigger: When creating domain entities, value objects, repository interfaces, or pure use cases.
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

## Domain Layer Rules

- **Zero framework dependencies** — no NestJS, no Prisma, no HTTP in domain layer
- Entities validate their own state and expose business methods
- Value Objects are **immutable** and validate their value in the constructor
- Repository interfaces define persistence **contracts** (ports) — never implementations
- Use Cases orchestrate domain operations — no HTTP, no infrastructure

---

## Entity Pattern

```typescript
// resource.ts
export interface ResourcePrimitives {
  readonly id: string;
  readonly tenantId: string;
  readonly name: string;
  readonly status: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Resource {
  private constructor(
    public readonly id: ResourceId,
    public readonly tenantId: TenantId,
    public name: ResourceName,
    public status: ResourceStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(
    params: Omit<ResourcePrimitives, 'id' | 'createdAt' | 'updatedAt'>,
  ): Resource {
    return new Resource(
      ResourceId.generate(),
      new TenantId(params.tenantId),
      new ResourceName(params.name),
      ResourceStatus.fromString(params.status),
      new Date(),
      new Date(),
    );
  }

  static fromPrimitives(primitives: ResourcePrimitives): Resource {
    return new Resource(
      new ResourceId(primitives.id),
      new TenantId(primitives.tenantId),
      new ResourceName(primitives.name),
      ResourceStatus.fromString(primitives.status),
      primitives.createdAt,
      primitives.updatedAt,
    );
  }

  toPrimitives(): ResourcePrimitives {
    return {
      id: this.id.value,
      tenantId: this.tenantId.value,
      name: this.name.value,
      status: this.status.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
```

---

## Value Object Pattern

Value Objects are **immutable** — validate in the constructor, no setters.

```typescript
// resource-id.ts
export class ResourceId {
  readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new InvalidArgumentError('ResourceId cannot be empty');
    }
    this.value = value;
  }

  static generate(): ResourceId {
    return new ResourceId(crypto.randomUUID());
  }
}

// resource-name.ts
export class ResourceName {
  readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new InvalidArgumentError('ResourceName cannot be empty');
    }
    if (value.length > 100) {
      throw new InvalidArgumentError(
        'ResourceName cannot exceed 100 characters',
      );
    }
    this.value = value.trim();
  }
}

// resource-status.ts
const RESOURCE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ARCHIVED: 'ARCHIVED',
} as const;

type ResourceStatusValue =
  (typeof RESOURCE_STATUS)[keyof typeof RESOURCE_STATUS];

export class ResourceStatus {
  readonly value: ResourceStatusValue;

  private constructor(value: ResourceStatusValue) {
    this.value = value;
  }

  static fromString(value: string): ResourceStatus {
    const valid = Object.values(RESOURCE_STATUS).includes(
      value as ResourceStatusValue,
    );
    if (!valid) {
      throw new InvalidArgumentError(`Invalid ResourceStatus: ${value}`);
    }
    return new ResourceStatus(value as ResourceStatusValue);
  }

  static active(): ResourceStatus {
    return new ResourceStatus(RESOURCE_STATUS.ACTIVE);
  }
}
```

---

## Repository Interface (Port)

Define the contract — never the implementation.

```typescript
// resource.repository.ts — this goes in the domain layer
export interface ResourceRepository {
  add(resource: Resource): Promise<void>;
  findById(id: ResourceId, tenantId: TenantId): Promise<Resource | null>;
  findByTenant(tenantId: TenantId): Promise<Resource[]>;
  update(resource: Resource): Promise<void>;
  remove(id: ResourceId, tenantId: TenantId): Promise<void>;
}
```

Multi-tenant rule: **every repository method takes `tenantId`** as a parameter or filters by it automatically. This is non-negotiable.

---

## Pure Use Case Pattern

```typescript
// resource-create.use-case.ts
export interface ResourceCreateInput {
  readonly tenantId: string;
  readonly name: string;
  readonly status?: string;
}

export class ResourceCreate {
  constructor(private readonly repository: ResourceRepository) {}

  async run(input: ResourceCreateInput): Promise<ResourcePrimitives> {
    const resource = Resource.create({
      tenantId: input.tenantId,
      name: input.name,
      status: input.status ?? 'ACTIVE',
    });
    await this.repository.add(resource);
    return resource.toPrimitives();
  }
}
```

Use case rules:

- Receives a **plain input object** (no entities, no DTOs)
- Returns **primitives** (`toPrimitives()`) — never raw domain entities
- Has **zero framework dependencies**
- One use case = **one operation**

---

## Domain Folder Structure

```
libs/shared/types/src/
└── your-domain/
    ├── entity.ts                  # Entity class
    ├── repository.ts              # Repository interface (port)
    ├── value-objects/
    │   ├── entity-id.ts
    │   ├── entity-name.ts
    │   └── entity-status.ts
    └── index.ts                   # Barrel export

apps/your-service/src/app/your-resource/
├── domain/                        # App-specific domain (if needed)
├── infrastructure/
│   └── prisma-resource.repository.ts   # Implements ResourceRepository
└── providers/
    └── resource-create.provider.ts     # NestJS DI wrapper
```

---

## Prisma Repository Implementation

The implementation lives in `infrastructure/`, **not** in the domain.

```typescript
// prisma-resource.repository.ts
@Injectable()
export class PrismaResourceRepository implements ResourceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async add(resource: Resource): Promise<void> {
    const data = resource.toPrimitives();
    await this.prisma.resource.create({ data });
  }

  async findById(id: ResourceId, tenantId: TenantId): Promise<Resource | null> {
    const record = await this.prisma.resource.findFirst({
      where: {
        id: id.value,
        tenantId: tenantId.value, // ALWAYS filter by tenantId
      },
    });
    if (!record) return null;
    return Resource.fromPrimitives(record);
  }
}
```

---

## Multi-Tenancy Rule (CRITICAL)

Every entity that belongs to a tenant MUST have `tenantId`. Every query MUST filter by `tenantId`. No exceptions.

```typescript
// ❌ DANGEROUS: Missing tenant isolation
await this.prisma.resource.findFirst({ where: { id } });

// ✅ CORRECT: Always scoped to tenant
await this.prisma.resource.findFirst({
  where: { id, tenantId: currentTenantId },
});
```
