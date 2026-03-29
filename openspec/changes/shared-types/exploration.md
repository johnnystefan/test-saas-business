# Exploration: shared-types

## Current State

`libs/shared/types/` (`@saas/shared-types`) exists as a scaffolded NX lib but contains only the
generator placeholder:

```typescript
// libs/shared/types/src/lib/shared-types.ts
export function sharedTypes(): string {
  return 'shared-types';
}
```

There are **zero real types, schemas, or domain models** defined yet. Every service (`auth-service`,
`club-service`, etc.) is also at skeleton level — they have `AppModule` with no business logic.
The workspace is a clean slate.

**Structural constraints already in place:**

- `tsconfig.base.json` maps `@saas/shared-types → libs/shared/types/src/index.ts`
- `project.json` tags: `scope:shared`, `type:types` — no platform restriction, usable by both
  frontend and backend
- `libs/shared/constants/` exists but is also a placeholder
- The `domain-errors` skill explicitly states `DomainError` base class lives in
  `libs/shared/types/src/errors/`
- The `nestjs-domain` skill shows domain folder structure rooted under `libs/shared/types/src/`
- The `zod-4` skill mandates `import { z } from 'zod/v4'` — **zod is not yet in `package.json`**

---

## Affected Areas

- `libs/shared/types/src/` — the primary delivery target; currently empty placeholder
- `libs/shared/types/package.json` — needs `zod/v4` as dependency
- `libs/shared/types/tsconfig.json` — currently uses `moduleResolution: "node16"` which is
  inconsistent with the workspace's `"bundler"` setting in `tsconfig.base.json`; needs alignment
- `libs/shared/constants/` — roles, status values defined here will be referenced by shared-types
- `apps/*/` — all services and apps will consume from `@saas/shared-types`
- `tsconfig.base.json` — already wired, no change needed

---

## The Six Questions

### 1. What entities belong in `shared-types`?

**Rule of thumb:** A type belongs in `shared-types` if it crosses at least **two service boundaries**
or is consumed by both frontend and backend.

| Entity                                                | Consumers                                                | Verdict                                                      | Justification                                |
| ----------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------- |
| `Tenant`                                              | auth, club, inventory, booking, finance, admin, customer | **IN**                                                       | Every service scopes data by tenant          |
| `User` (primitives)                                   | auth, api-gateway, admin, customer                       | **IN**                                                       | JWT payload, RBAC, UI profile                |
| `UserRole` enum                                       | auth, all services (guards), admin, customer             | **IN**                                                       | RBAC is cross-cutting                        |
| `BusinessUnit`                                        | club, booking, inventory, admin                          | **IN**                                                       | Physical location used by 4+ services        |
| `Member` (primitives)                                 | club, booking, admin, customer                           | **IN**                                                       | Core identity of a student/player            |
| `Pagination` / `SortInput`                            | All services (list endpoints), admin                     | **IN**                                                       | Universal API pattern                        |
| `ApiResponse<T>` wrapper                              | api-gateway, admin-gateway, all clients                  | **IN**                                                       | Consistent HTTP envelope                     |
| `DomainError` base + error codes                      | All services, api-gateway                                | **IN**                                                       | Skills mandate this lives here               |
| `BaseEntity` (id, tenantId, timestamps)               | All domain entities                                      | **IN**                                                       | Foundation for all models                    |
| `Booking` (full)                                      | booking-service only → admin for display                 | **PARTIAL** — primitives IN, business logic stays in service | Full entity + use cases stay local           |
| `Inventory item` (full)                               | inventory-service only                                   | **OUT** — service-local                                      | Only consumed by one service                 |
| `Finance/Payment` (full)                              | finance-service only                                     | **OUT** — service-local                                      | Only consumed by one service                 |
| `Slot` / `Schedule` (full)                            | booking-service only                                     | **OUT** — service-local                                      | Internal domain model                        |
| Club-specific sports types (baseball positions, etc.) | club-service + some admin views                          | **BORDERLINE** — explore in propose                          | Could go in a future `@saas/domain-club` lib |

**Summary of what goes IN:**

- Base types: `BaseEntity`, `TenantedEntity`, pagination, API envelope
- Cross-cutting identifiers: `TenantId`, `UserId`, `BusinessUnitId`
- Shared domain primitives: `UserPrimitives`, `MemberPrimitives`, `BusinessUnitPrimitives`
- RBAC: `UserRole`, `Permission` enum/const
- Error infrastructure: `DomainError`, `DOMAIN_ERROR_TYPE`, generic error classes
- Zod schemas for all of the above (source of truth)

### 2. What's the right granularity?

**Two failure modes to avoid:**

| Failure        | Symptom                                                                       | Fix                                                 |
| -------------- | ----------------------------------------------------------------------------- | --------------------------------------------------- |
| **Too broad**  | `shared-types` imports from `booking-service`; booking logic leaks into admin | Keep it to cross-cutting primitives only            |
| **Too narrow** | `UserRole` defined in both `auth-service` and `admin`; drift inevitable       | Extract to shared the moment it's used in 2+ places |

**Recommendation:** Define a `[Entity]Primitives` interface for each shared entity. Services own the
full domain class (with methods, value objects). `shared-types` only owns the **data shape** (the
plain object that crosses service boundaries). This aligns with the `nestjs-domain` skill pattern
where `toPrimitives()` / `fromPrimitives()` are the seam.

```
shared-types owns:  UserPrimitives (plain object shape + Zod schema)
auth-service owns:  User (class with value objects, business methods, repository)
```

### 3. Domain primitives vs Zod schemas + inferred types?

**Decision: Zod schemas as source of truth, no Value Objects in shared-types.**

Reasoning:

- Value Objects (e.g. `ResourceId`, `ResourceName`) have **behavior** (validation in constructor,
  `generate()`, etc.) and depend on `InvalidArgumentError`. They are tightly coupled to the domain
  layer of a specific service.
- `shared-types` must be **zero-framework, zero-behavior** — pure data contracts.
- Frontend (React) needs Zod schemas for form validation. Backend (NestJS) needs them for
  `createZodDto`. Both import from `@saas/shared-types`. ✓
- TypeScript types are inferred via `z.infer<typeof Schema>` — no duplication.

**Exception:** `DomainError` base class and `InvalidArgumentError` CAN live here because they are
pure TypeScript classes with zero framework dependencies, and the `domain-errors` skill explicitly
mandates this location.

### 4. Base structure every entity needs?

```typescript
// BaseEntitySchema — everything has this
{
  id: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
}

// TenantedEntitySchema — tenant-scoped entities extend this
{
  id: z.uuid(),
  tenantId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
}
```

**Rule:** Tenant-global entities (Tenant itself, system-level User accounts) use `BaseEntitySchema`.
Everything else uses `TenantedEntitySchema`. No exceptions.

### 5. DomainError — shared-types or separate lib?

**Decision: Keep in `shared-types`.**

Reasons:

- The `domain-errors` skill already documents the location as `libs/shared/types/src/errors/`
- Concrete domain errors (e.g. `UserNotFoundError`) stay **service-local** in
  `apps/[service]/src/app/[resource]/domain/errors/`
- `DomainError` base class has zero dependencies (pure TypeScript)
- `DomainValidationError` depends on `zod/v4` — also a valid dependency for `shared-types`
- If we split into `@saas/domain-errors`, every service would need both packages. That's
  unnecessary coupling for zero benefit.

A future `@saas/error-filter` (platform:node only) can own the NestJS exception filter
without polluting shared-types with NestJS decorators.

### 6. How to export Zod schemas for both frontend and backend?

**Decision: Single barrel export, no platform split.**

The `shared-types` lib has no `platform` tag — it is intentionally universal. Zod 4 is a
pure TypeScript library with no Node.js or browser dependencies.

**Key pattern:**

```typescript
// libs/shared/types/src/user/index.ts
export { UserSchema, CreateUserSchema, UpdateUserSchema } from './user.schemas';
export type {
  UserPrimitives,
  CreateUserInput,
  UpdateUserInput,
} from './user.schemas';

// Consumer (backend)
import { CreateUserSchema } from '@saas/shared-types';
export class CreateUserDto extends createZodDto(CreateUserSchema) {}

// Consumer (frontend)
import { CreateUserSchema } from '@saas/shared-types';
const form = useForm({ resolver: zodResolver(CreateUserSchema) });
```

**Zod import:** `import { z } from 'zod/v4'` everywhere. The package.json of
`shared-types` will need `zod` as a direct dependency (not just devDependency).

---

## Proposed File Structure

```
libs/shared/types/src/
│
├── index.ts                          ← barrel: re-exports everything
│
├── base/
│   ├── base-entity.schemas.ts        ← BaseEntitySchema, TenantedEntitySchema
│   ├── pagination.schemas.ts         ← PaginationInputSchema, PaginatedResponseSchema<T>
│   ├── api-response.schemas.ts       ← ApiResponseSchema<T>, ApiErrorSchema
│   └── index.ts
│
├── errors/
│   ├── domain-error.ts               ← DomainError abstract class + DOMAIN_ERROR_TYPE const
│   ├── invalid-argument.error.ts     ← InvalidArgumentError (used by Value Objects)
│   ├── business-rule-violation.error.ts
│   ├── domain-validation.error.ts    ← DomainValidationError (wraps ZodError)
│   └── index.ts
│
├── tenant/
│   ├── tenant.schemas.ts             ← TenantSchema, CreateTenantSchema, TenantPrimitives
│   └── index.ts
│
├── user/
│   ├── user.schemas.ts               ← UserSchema, CreateUserSchema, UserPrimitives
│   ├── user-role.const.ts            ← USER_ROLE const + UserRole type
│   └── index.ts
│
├── member/
│   ├── member.schemas.ts             ← MemberSchema, CreateMemberSchema, MemberPrimitives
│   ├── member-status.const.ts        ← MEMBER_STATUS const + MemberStatus type
│   └── index.ts
│
├── business-unit/
│   ├── business-unit.schemas.ts      ← BusinessUnitSchema, BusinessUnitPrimitives
│   └── index.ts
│
└── booking/
    ├── booking.schemas.ts            ← BookingPrimitives only (not full domain model)
    ├── booking-status.const.ts       ← BOOKING_STATUS const
    └── index.ts
```

**What stays OUT (service-local):**

- `Slot`, `Schedule`, `Availability` → `apps/booking-service/`
- `InventoryItem`, `StockMovement` → `apps/inventory-service/`
- `Payment`, `Invoice`, `Subscription` → `apps/finance-service/`
- `TrainingProgram`, `Position` (baseball) → `apps/club-service/` (or future `@saas/domain-club`)
- All repository interfaces → `apps/[service]/src/app/[domain]/domain/`
- All Value Objects → `apps/[service]/src/app/[domain]/domain/value-objects/`
- All Use Cases → `apps/[service]/src/app/[domain]/`
- NestJS exception filter → `apps/[service]/src/core/filters/`

---

## Key Architectural Decisions

### Decision A: Zod schemas are the single source of truth

TypeScript types are **always inferred** from Zod schemas with `z.infer<typeof Schema>`. Never
define types independently. This ensures runtime validation and compile-time types are always in
sync.

**Tradeoff:** `shared-types` gains a runtime dependency on `zod`. This is acceptable because
every consumer (frontend form validation, backend DTO validation) needs Zod anyway.

### Decision B: `[Entity]Primitives` is the cross-service contract, not the domain class

Services communicate via plain objects (primitive shapes). The domain class with business methods
and value objects lives exclusively inside each service. This enforces hexagonal architecture:
the domain is never shared, only its data shape is.

**Tradeoff:** Some duplication of `id/tenantId/timestamps` fields in every schema. Mitigated by
composing `TenantedEntitySchema` as a base.

### Decision C: DomainError lives in shared-types, concrete errors stay service-local

Generic error infrastructure (base class, error codes, `InvalidArgumentError`) is shared.
Domain-specific errors (`UserNotFoundError`, `BookingConflictError`) are local to each service
and never exported from `shared-types`.

**Tradeoff:** Services that need each other's error types (e.g. api-gateway catching a
`BookingConflictError`) must either re-throw a generic error or the gateway must not catch typed
domain errors from downstream services. This is the correct behavior — the gateway should deal in
HTTP errors, not domain errors from microservices.

### Decision D: No platform split — one universal barrel export

`shared-types` has no `platform` tag and exports everything from one barrel. Frontend and
backend import from the same package.

**Tradeoff:** If a schema accidentally uses a Node.js-only type (e.g. `Buffer`), it would break
frontend builds. Mitigation: strict review rule — schemas use only `z.string()`, `z.date()`,
`z.uuid()`, `z.number()`, etc. No Node.js primitives.

### Decision E: `module: "node16"` in lib tsconfig must be fixed

The current `libs/shared/types/tsconfig.json` sets `moduleResolution: "node16"` which
contradicts the workspace's `"bundler"` setting. This must be changed to `"bundler"` (or
`"esnext"`) to align with TS6 conventions documented in the `typescript` skill.

---

## Open Questions for the Propose Phase

1. **Booking primitives granularity:** Should `BookingPrimitives` include the slot/time details
   (start/end datetime) or just the booking header (id, memberId, businessUnitId, status)?
   The decision affects how much of the booking domain leaks into shared space.

2. **`booking` folder in shared-types:** The booking entity is consumed by both the booking service
   AND the admin dashboard (for display). Does that justify its primitives being in shared-types,
   or should admin-gateway use a ViewModel/DTO mapped from the service response? Consider the
   admin-gateway as the right translation layer instead.

3. **Zod dependency management:** Should `zod` be added to the workspace root `package.json`
   (as it is today — not present), and `shared-types/package.json` declare it as a peer dependency?
   Or should each consumer declare `zod` independently and `shared-types` use `z` as a dev/peer?
   Recommendation: `zod` at workspace root (hoisted by pnpm), `shared-types` declares it as
   `peerDependency`.

4. **`shared-constants` dependency:** `shared-types` may want to import role/status values from
   `@saas/shared-constants`. The NX boundary spec says `shared-types` MAY import from
   `@saas/shared-constants`. Should status consts live in `shared-constants` (constants lib) or
   co-located in `shared-types`? Recommendation: co-locate in `shared-types` since they are
   tightly coupled to the type schemas.

5. **Club/sport-specific types:** Baseball positions, training categories, equipment types —
   should these ever enter `shared-types` or always stay service-local? The platform is designed
   to scale to other sports. Creating a `@saas/domain-club` lib (or even `@saas/domain-baseball`)
   may be the right long-term answer, but that's out of scope for this change.

6. **`ApiResponse<T>` generic schema:** Zod 4 supports generic schemas via functions
   (`z.object({ data: innerSchema })`). Should we define `apiResponseSchema<T extends z.ZodType>`
   as a factory function or use `z.unknown()` and cast at the callsite? This matters for type
   safety in the admin's React Query hooks.

---

## Recommendation

Proceed to **propose** with this scope:

1. Implement the file structure above in `libs/shared/types/src/`
2. Add `zod` dependency to workspace `package.json` + `shared-types/package.json`
3. Fix `tsconfig.json` in `shared-types` (`moduleResolution: "bundler"`)
4. Start with: `base/`, `errors/`, `user/` (includes `UserRole`), `tenant/`, `member/`,
   `business-unit/`
5. Leave `booking/` primitives for a follow-up change once the booking domain is better understood
6. Do NOT add Value Objects, repository interfaces, or business logic

**Effort:** Medium — mostly schema definition work, no infrastructure changes.
**Risk:** Low — this is greenfield, nothing consumes `@saas/shared-types` yet.

---

## Ready for Proposal

**Yes.** The exploration is complete. The questions above are refinement decisions for the
proposal author, not blockers. The core architectural shape is clear.
