# Design: club-service

## Technical Approach

Follow auth-service's established patterns: plain type entities (no DDD classes), repository interfaces as contracts, use cases as orchestrators, Prisma repositories as infrastructure. Reuse `@saas/shared-types` (MemberSchema, BusinessUnitSchema, TenantSchema) for domain alignment.

## Architecture Decisions

| #   | Decision                                      | Alternative                              | Rationale                                                                         |
| --- | --------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------- |
| 1   | Plain type entities (like auth-service)       | DDD class entities (nestjs-domain skill) | Consistency with existing codebase; simpler, less boilerplate                     |
| 2   | Separate Prisma client output (`club-client`) | Shared Prisma client                     | Each service owns its DB schema independently                                     |
| 3   | `tenant_id` on all tables + query filtering   | Row-level security (RLS)                 | Simpler, portable, matches auth-service pattern                                   |
| 4   | BusinessUnit instead of "Club"                | Direct "Club" entity                     | Aligns with `@saas/shared-types` `BusinessUnitSchema` — a club IS a business unit |
| 5   | `nestjs-zod` ZodValidationPipe for DTOs       | class-validator                          | Matches auth-service pattern; single validation library                           |
| 6   | Use cases injected via factory in module      | Direct DI                                | Matches auth-service pattern; use cases are pure, no decorators                   |

## Data Flow

```
Controller ──→ Service ──→ UseCase ──→ IRepository (interface)
                                            │
                                    PrismaRepository (impl)
                                            │
                                      PostgreSQL DB
```

## Prisma Schema (club-service DB)

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../../../node_modules/.prisma/club-client"
}

datasource db {
  provider = "postgresql"
}

model BusinessUnit {
  id        String   @id @default(uuid())
  tenantId  String   @map("tenant_id")
  name      String
  type      String
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  memberships Membership[]

  @@map("business_units")
}

model Member {
  id         String   @id @default(uuid())
  tenantId   String   @map("tenant_id")
  name       String
  email      String?
  phone      String?
  status     String   @default("ACTIVE")
  enrolledAt DateTime @default(now()) @map("enrolled_at")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  memberships Membership[]

  @@unique([email, tenantId])
  @@map("members")
}

model Membership {
  id             String    @id @default(uuid())
  tenantId       String    @map("tenant_id")
  memberId       String    @map("member_id")
  businessUnitId String    @map("business_unit_id")
  status         String    @default("ACTIVE")
  startDate      DateTime  @map("start_date")
  endDate        DateTime? @map("end_date")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  member       Member       @relation(fields: [memberId], references: [id], onDelete: Cascade)
  businessUnit BusinessUnit @relation(fields: [businessUnitId], references: [id], onDelete: Cascade)

  @@unique([memberId, businessUnitId])
  @@map("memberships")
}
```

## File Changes

| File                                                                             | Action | Description                      |
| -------------------------------------------------------------------------------- | ------ | -------------------------------- |
| `apps/club-service/prisma/schema.prisma`                                         | Create | DB schema with 3 models          |
| `apps/club-service/prisma.config.ts`                                             | Create | Prisma 7 config (defineConfig)   |
| `apps/club-service/src/main.ts`                                                  | Modify | Add globalPrefix `api/v1`        |
| `apps/club-service/src/app/app.module.ts`                                        | Modify | Import domain modules            |
| `apps/club-service/src/app/app.controller.ts`                                    | Delete | Remove placeholder               |
| `apps/club-service/src/app/app.service.ts`                                       | Delete | Remove placeholder               |
| `apps/club-service/src/infrastructure/prisma/prisma.service.ts`                  | Create | PrismaClient extends             |
| `apps/club-service/src/domain/business-unit/business-unit.entity.ts`             | Create | BusinessUnit type + CreateData   |
| `apps/club-service/src/domain/business-unit/i-business-unit.repository.ts`       | Create | Repository interface             |
| `apps/club-service/src/domain/member/member.entity.ts`                           | Create | Member type + CreateData         |
| `apps/club-service/src/domain/member/i-member.repository.ts`                     | Create | Repository interface             |
| `apps/club-service/src/domain/membership/membership.entity.ts`                   | Create | Membership type + CreateData     |
| `apps/club-service/src/domain/membership/i-membership.repository.ts`             | Create | Repository interface             |
| `apps/club-service/src/domain/use-cases/create-business-unit.use-case.ts`        | Create | Create business unit             |
| `apps/club-service/src/domain/use-cases/list-business-units.use-case.ts`         | Create | List by tenant                   |
| `apps/club-service/src/domain/use-cases/update-business-unit.use-case.ts`        | Create | Update name/type/status          |
| `apps/club-service/src/domain/use-cases/register-member.use-case.ts`             | Create | Register new member              |
| `apps/club-service/src/domain/use-cases/list-members.use-case.ts`                | Create | List by tenant                   |
| `apps/club-service/src/domain/use-cases/enroll-member.use-case.ts`               | Create | Create membership                |
| `apps/club-service/src/domain/use-cases/update-membership.use-case.ts`           | Create | Change status                    |
| `apps/club-service/src/domain/use-cases/list-memberships.use-case.ts`            | Create | List by business unit            |
| `apps/club-service/src/infrastructure/prisma/prisma-business-unit.repository.ts` | Create | Prisma impl                      |
| `apps/club-service/src/infrastructure/prisma/prisma-member.repository.ts`        | Create | Prisma impl                      |
| `apps/club-service/src/infrastructure/prisma/prisma-membership.repository.ts`    | Create | Prisma impl                      |
| `apps/club-service/src/business-unit/business-unit.controller.ts`                | Create | CRUD endpoints                   |
| `apps/club-service/src/business-unit/business-unit.service.ts`                   | Create | Orchestrates use cases           |
| `apps/club-service/src/business-unit/business-unit.module.ts`                    | Create | NestJS module                    |
| `apps/club-service/src/business-unit/dto/create-business-unit.dto.ts`            | Create | Zod schema + type                |
| `apps/club-service/src/business-unit/dto/update-business-unit.dto.ts`            | Create | Zod schema + type                |
| `apps/club-service/src/member/member.controller.ts`                              | Create | CRUD + enrollment                |
| `apps/club-service/src/member/member.service.ts`                                 | Create | Orchestrates use cases           |
| `apps/club-service/src/member/member.module.ts`                                  | Create | NestJS module                    |
| `apps/club-service/src/member/dto/register-member.dto.ts`                        | Create | Zod schema + type                |
| `apps/club-service/src/member/dto/enroll-member.dto.ts`                          | Create | Zod schema + type                |
| `apps/club-service/src/member/dto/update-membership.dto.ts`                      | Create | Zod schema + type                |
| `apps/club-service/jest.config.cts`                                              | Create | Jest config (match auth-service) |
| `apps/club-service/tsconfig.spec.json`                                           | Create | TS config for tests              |

## Interfaces / Contracts

```typescript
// IBusinessUnitRepository
interface IBusinessUnitRepository {
  create(data: CreateBusinessUnitData): Promise<BusinessUnit>;
  findById(id: string, tenantId: string): Promise<BusinessUnit | null>;
  findAllByTenant(tenantId: string): Promise<BusinessUnit[]>;
  update(
    id: string,
    tenantId: string,
    data: Partial<Pick<BusinessUnit, 'name' | 'type' | 'isActive'>>,
  ): Promise<BusinessUnit>;
}

// IMemberRepository
interface IMemberRepository {
  create(data: CreateMemberData): Promise<Member>;
  findById(id: string, tenantId: string): Promise<Member | null>;
  findByEmail(email: string, tenantId: string): Promise<Member | null>;
  findAllByTenant(tenantId: string): Promise<Member[]>;
}

// IMembershipRepository
interface IMembershipRepository {
  create(data: CreateMembershipData): Promise<Membership>;
  findByMemberAndUnit(
    memberId: string,
    businessUnitId: string,
  ): Promise<Membership | null>;
  findAllByBusinessUnit(
    businessUnitId: string,
    tenantId: string,
  ): Promise<Membership[]>;
  updateStatus(
    id: string,
    tenantId: string,
    status: string,
  ): Promise<Membership>;
}
```

## Testing Strategy

| Layer  | What to Test        | Approach                                        |
| ------ | ------------------- | ----------------------------------------------- |
| Unit   | Use cases (7 total) | Mock repository interfaces, test business rules |
| Unit   | Domain entities     | Validate type constraints                       |
| Module | NestJS wiring       | Test DI resolution                              |

## Migration / Rollout

- `npx prisma migrate dev` against local PostgreSQL (separate DB from auth-service)
- Env var: `CLUB_DATABASE_URL` (distinct from auth-service's `DATABASE_URL`)

## Open Questions

None — design follows established auth-service patterns.
