# Tasks: club-service

## Phase 1 — Infrastructure Setup

### [x] Task 1.1: Create Prisma schema and config

- **Files**: `apps/club-service/prisma/schema.prisma`, `apps/club-service/prisma.config.ts`
- **Done when**: Schema has BusinessUnit, Member, Membership models; config uses `defineConfig` with `CLUB_DATABASE_URL`

### [x] Task 1.2: Create PrismaService

- **Files**: `apps/club-service/src/infrastructure/prisma/prisma.service.ts`
- **Done when**: Extends PrismaClient from `.prisma/club-client`, implements OnModuleInit/OnModuleDestroy
- **Requires**: 1.1

### [x] Task 1.3: Create Jest + TS test config

- **Files**: `apps/club-service/jest.config.cts`, `apps/club-service/tsconfig.spec.json`
- **Done when**: Matches auth-service pattern, resolves `@saas/*` paths

### [x] Task 1.4: Update main.ts

- **Files**: `apps/club-service/src/main.ts`
- **Done when**: Has `globalPrefix = 'api/v1'`, proper port config

## Phase 2 — Domain Layer (entities + repositories)

### [x] Task 2.1: BusinessUnit entity + repository interface

- **Files**: `apps/club-service/src/domain/business-unit/business-unit.entity.ts`, `apps/club-service/src/domain/business-unit/i-business-unit.repository.ts`
- **Done when**: Types `BusinessUnit`, `CreateBusinessUnitData` exist; `IBusinessUnitRepository` interface defined

### [x] Task 2.2: Member entity + repository interface

- **Files**: `apps/club-service/src/domain/member/member.entity.ts`, `apps/club-service/src/domain/member/i-member.repository.ts`
- **Done when**: Types `Member`, `CreateMemberData` exist; `IMemberRepository` interface defined

### [x] Task 2.3: Membership entity + repository interface

- **Files**: `apps/club-service/src/domain/membership/membership.entity.ts`, `apps/club-service/src/domain/membership/i-membership.repository.ts`
- **Done when**: Types `Membership`, `CreateMembershipData` exist; `IMembershipRepository` interface defined

## Phase 3 — Use Cases

### [x] Task 3.1: CreateBusinessUnit use case

- **Files**: `apps/club-service/src/domain/use-cases/create-business-unit.use-case.ts`
- **Done when**: Accepts CreateBusinessUnitData, calls repository.create, returns BusinessUnit
- **Requires**: 2.1

### [x] Task 3.2: ListBusinessUnits use case

- **Files**: `apps/club-service/src/domain/use-cases/list-business-units.use-case.ts`
- **Done when**: Accepts tenantId, returns BusinessUnit[]
- **Requires**: 2.1

### [x] Task 3.3: UpdateBusinessUnit use case

- **Files**: `apps/club-service/src/domain/use-cases/update-business-unit.use-case.ts`
- **Done when**: Validates entity exists for tenant, updates fields, returns updated BusinessUnit
- **Requires**: 2.1

### [x] Task 3.4: RegisterMember use case

- **Files**: `apps/club-service/src/domain/use-cases/register-member.use-case.ts`
- **Done when**: Validates email unique per tenant, creates member, returns Member
- **Requires**: 2.2

### [x] Task 3.5: ListMembers use case

- **Files**: `apps/club-service/src/domain/use-cases/list-members.use-case.ts`
- **Done when**: Accepts tenantId, returns Member[]
- **Requires**: 2.2

### [x] Task 3.6: EnrollMember use case

- **Files**: `apps/club-service/src/domain/use-cases/enroll-member.use-case.ts`
- **Done when**: Validates no duplicate enrollment, validates same tenant, creates membership
- **Requires**: 2.2, 2.3

### [x] Task 3.7: UpdateMembership use case

- **Files**: `apps/club-service/src/domain/use-cases/update-membership.use-case.ts`
- **Done when**: Updates membership status (ACTIVE/SUSPENDED/INACTIVE)
- **Requires**: 2.3

### [x] Task 3.8: ListMemberships use case

- **Files**: `apps/club-service/src/domain/use-cases/list-memberships.use-case.ts`
- **Done when**: List memberships by business unit with member details
- **Requires**: 2.3

## Phase 4 — Infrastructure (Prisma repositories)

### [x] Task 4.1: PrismaBusinessUnitRepository

- **Files**: `apps/club-service/src/infrastructure/prisma/prisma-business-unit.repository.ts`
- **Done when**: Implements IBusinessUnitRepository, all queries filter by tenantId
- **Requires**: 1.2, 2.1

### [x] Task 4.2: PrismaMemberRepository

- **Files**: `apps/club-service/src/infrastructure/prisma/prisma-member.repository.ts`
- **Done when**: Implements IMemberRepository, all queries filter by tenantId
- **Requires**: 1.2, 2.2

### [x] Task 4.3: PrismaMembershipRepository

- **Files**: `apps/club-service/src/infrastructure/prisma/prisma-membership.repository.ts`
- **Done when**: Implements IMembershipRepository, includes member data in queries
- **Requires**: 1.2, 2.3

## Phase 5 — Presentation Layer (DTOs + Controllers + Services + Modules)

### [x] Task 5.1: BusinessUnit DTOs

- **Files**: `apps/club-service/src/business-unit/dto/create-business-unit.dto.ts`, `apps/club-service/src/business-unit/dto/update-business-unit.dto.ts`
- **Done when**: Zod schemas validate input, types exported

### [x] Task 5.2: BusinessUnit service + controller + module

- **Files**: `apps/club-service/src/business-unit/business-unit.service.ts`, `apps/club-service/src/business-unit/business-unit.controller.ts`, `apps/club-service/src/business-unit/business-unit.module.ts`
- **Done when**: CRUD endpoints work (POST create, GET list, PATCH update), service delegates to use cases
- **Requires**: 3.1, 3.2, 3.3, 4.1, 5.1

### [x] Task 5.3: Member DTOs

- **Files**: `apps/club-service/src/member/dto/register-member.dto.ts`, `apps/club-service/src/member/dto/enroll-member.dto.ts`, `apps/club-service/src/member/dto/update-membership.dto.ts`
- **Done when**: Zod schemas validate input, types exported

### [x] Task 5.4: Member service + controller + module

- **Files**: `apps/club-service/src/member/member.service.ts`, `apps/club-service/src/member/member.controller.ts`, `apps/club-service/src/member/member.module.ts`
- **Done when**: Endpoints work (POST register, GET list, POST enroll, PATCH membership, GET memberships by unit)
- **Requires**: 3.4, 3.5, 3.6, 3.7, 3.8, 4.2, 4.3, 5.3

## Phase 6 — Wiring

### [x] Task 6.1: Update AppModule

- **Files**: `apps/club-service/src/app/app.module.ts`
- **Done when**: Imports BusinessUnitModule + MemberModule, removes placeholder controller/service
- **Requires**: 5.2, 5.4

### [x] Task 6.2: Delete placeholder files

- **Files**: `apps/club-service/src/app/app.controller.ts`, `apps/club-service/src/app/app.service.ts`
- **Done when**: Files deleted
- **Requires**: 6.1

## Phase 7 — Tests

### [x] Task 7.1: Use case unit tests

- **Files**: `apps/club-service/src/domain/use-cases/*.spec.ts`
- **Done when**: All 8 use cases have tests with mocked repositories, business rules validated
- **Requires**: Phase 3

### [x] Task 7.2: Lint verification

- **Done when**: `pnpm nx lint club-service` passes with 0 errors
- **Requires**: Phase 6
