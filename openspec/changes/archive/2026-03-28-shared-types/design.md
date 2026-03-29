# Design: shared-types

## Technical Approach

Replace the generator placeholder in `libs/shared/types/src/` with a structured set of Zod schemas, inferred TypeScript types, status constants, and a pure-TS error hierarchy. No business logic, no framework dependencies. Fix the lib's tsconfig and wire `zod` into the workspace. The public API is a single barrel at `src/index.ts`.

---

## Architecture Decisions

| #   | Choice                                                                                     | Alternatives Considered                   | Rationale                                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------ | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `z.infer<typeof Schema>` as single source of truth — no standalone `interface` duplicates  | Separate `interface` + `Schema` in sync   | Schema + inferred type cannot drift. Frontend (RHF `zodResolver`) and backend (`createZodDto`) both need the schema object, not just the type.                                                            |
| 2   | Timestamps as `z.iso.datetime()` strings (JSON-safe), not `z.date()`                       | `z.date()` (native Date)                  | Cross-service HTTP boundaries always serialize to strings. `z.date()` would coerce on parse and fail in plain JSON contexts. ISO strings are safe everywhere.                                             |
| 3   | `TenantedEntitySchema = BaseEntitySchema.extend({ tenantId })` via `.extend()`             | `z.object().merge()`                      | `.extend()` is idiomatic for "add fields to a base schema". `merge()` is for combining two peer schemas. Exploration confirms all tenant-scoped entities extend the base.                                 |
| 4   | Status/role constants as `const OBJ = { KEY: 'value' } as const` + inferred union type     | `enum`, `union([z.literal(...)])`         | `as const` object is tree-shakeable, serializes cleanly, and allows `Object.values()` iteration. `z.enum()` receives `Object.values(OBJ)` to link schema ↔ const. See spec requirement for this pattern. |
| 5   | `DomainError` as abstract class (not interface)                                            | `interface DomainError`                   | Services need `instanceof DomainError` checks in exception filters. An interface cannot be used in `instanceof`. The `domain-errors` skill mandates abstract class.                                       |
| 6   | `DomainValidationError` inside `errors/` (depends on `zod/v4`)                             | Separate lib `@saas/domain-zod-errors`    | Single runtime dep (`zod`) is already required. Splitting for one class adds indirection with zero benefit.                                                                                               |
| 7   | `apiResponseSchema<T>` as a factory function                                               | `z.unknown()` field with cast at callsite | Type inference is preserved at every callsite without a cast. Zod 4 supports generic schema factories via higher-order functions.                                                                         |
| 8   | `zod` as `peerDependency` in `libs/shared/types/package.json`, installed at workspace root | Regular `dependency`                      | pnpm hoists it once. Every consumer (NestJS, React) already needs `zod` directly — declaring it as a peer avoids double-bundling and makes the contract explicit.                                         |
| 9   | `moduleResolution: "bundler"` + `module: "esnext"` in lib tsconfig                         | Keep `"node16"`                           | `tsconfig.base.json` already uses `"bundler"`. Misalignment causes TS6 path resolution errors. Change aligns the lib with the workspace convention.                                                       |
| 10  | Status consts co-located in entity folder (`user/user-role.const.ts`)                      | Move to `@saas/shared-constants`          | Constants are tightly coupled to their schema. Co-location means one import resolves both the schema and the valid values. Proposal explicitly chose co-location.                                         |

---

## Data Flow

```
Frontend (React)                     Backend (NestJS service)
     │                                        │
     │  import { UserSchema, USER_ROLE }       │  import { CreateUserSchema }
     │  from '@saas/shared-types'              │  from '@saas/shared-types'
     │                                        │
     ▼                                        ▼
  zodResolver(UserSchema)            createZodDto(CreateUserSchema)
  (React Hook Form)                  (ZodValidationPipe validates body)
     │                                        │
     ▼                                        ▼
  z.infer<typeof UserSchema>         type CreateUserInput = z.infer<typeof CreateUserSchema>
  (compile-time safety)              (same shape, same source)
```

Schema composition chain:

```
BaseEntitySchema
       │
       └─ .extend({ tenantId }) ──→ TenantedEntitySchema
                                           │
                    ┌──────────────────────┼────────────────────┐
                    ▼                      ▼                     ▼
             TenantSchema           UserSchema             MemberSchema
             (global entity,        (tenanted)             (tenanted)
              extends Base)
                                                          BusinessUnitSchema
                                                          (tenanted)
```

---

## File Changes

| File                                                              | Action | Description                                                                                       |
| ----------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------- |
| `libs/shared/types/src/base/base-entity.schema.ts`                | Create | `BaseEntitySchema` (id, createdAt, updatedAt) and `TenantedEntitySchema` (.extend with tenantId)  |
| `libs/shared/types/src/base/index.ts`                             | Create | Re-exports from base/                                                                             |
| `libs/shared/types/src/errors/domain-error.ts`                    | Create | `DOMAIN_ERROR_TYPE`, `DomainErrorCode`, `DomainErrorContext`, `DomainError` abstract class        |
| `libs/shared/types/src/errors/domain-validation.error.ts`         | Create | `DomainValidationError` wrapping `z.ZodError`                                                     |
| `libs/shared/types/src/errors/invalid-argument.error.ts`          | Create | `InvalidArgumentError` for Value Object guard clauses                                             |
| `libs/shared/types/src/errors/business-rule-violation.error.ts`   | Create | `BusinessRuleViolationError`                                                                      |
| `libs/shared/types/src/errors/index.ts`                           | Create | Re-exports from errors/                                                                           |
| `libs/shared/types/src/tenant/tenant.schema.ts`                   | Create | `TenantSchema` (extends BaseEntitySchema), `TenantPrimitives`                                     |
| `libs/shared/types/src/tenant/index.ts`                           | Create | Re-exports from tenant/                                                                           |
| `libs/shared/types/src/user/user-role.const.ts`                   | Create | `USER_ROLE as const`, `UserRole` inferred type                                                    |
| `libs/shared/types/src/user/user.schema.ts`                       | Create | `UserSchema` (extends TenantedEntitySchema), `UserPrimitives`, `CreateUserSchema`                 |
| `libs/shared/types/src/user/index.ts`                             | Create | Re-exports from user/                                                                             |
| `libs/shared/types/src/member/member-status.const.ts`             | Create | `MEMBER_STATUS as const`, `MemberStatus` inferred type                                            |
| `libs/shared/types/src/member/member.schema.ts`                   | Create | `MemberSchema` (extends TenantedEntitySchema), optional email/phone                               |
| `libs/shared/types/src/member/index.ts`                           | Create | Re-exports from member/                                                                           |
| `libs/shared/types/src/business-unit/business-unit-type.const.ts` | Create | `BUSINESS_UNIT_TYPE as const`, `BusinessUnitType` inferred type                                   |
| `libs/shared/types/src/business-unit/business-unit.schema.ts`     | Create | `BusinessUnitSchema` (extends TenantedEntitySchema), isActive boolean                             |
| `libs/shared/types/src/business-unit/index.ts`                    | Create | Re-exports from business-unit/                                                                    |
| `libs/shared/types/src/common/api-response.schema.ts`             | Create | `apiResponseSchema<T>()` factory, `paginatedResponseSchema<T>()` factory, `PaginationInputSchema` |
| `libs/shared/types/src/common/index.ts`                           | Create | Re-exports from common/                                                                           |
| `libs/shared/types/src/index.ts`                                  | Modify | Replace placeholder re-export with full public barrel                                             |
| `libs/shared/types/src/lib/shared-types.ts`                       | Delete | Generator placeholder — no longer needed                                                          |
| `libs/shared/types/src/lib/shared-types.spec.ts`                  | Delete | Placeholder spec — replaced by real specs                                                         |
| `libs/shared/types/tsconfig.json`                                 | Modify | `module: "esnext"`, `moduleResolution: "bundler"` (remove node16)                                 |
| `libs/shared/types/package.json`                                  | Modify | Add `zod` as `peerDependency`                                                                     |
| `package.json` (workspace root)                                   | Modify | Add `zod` to `dependencies`                                                                       |

---

## Interfaces / Contracts

### Schema composition pattern (non-obvious — factory for generics)

```typescript
// ✅ Generic response factory — preserves type inference at callsite
import { z } from 'zod/v4';

export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    message: z.string(),
  });

export const paginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
  });

// Usage (backend):
const UserListResponse = paginatedResponseSchema(UserSchema);
type UserListResponse = z.infer<typeof UserListResponse>;
```

### Status const → schema link pattern

```typescript
// ✅ Const as source of truth, schema derives from it
export const USER_ROLE = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TENANT_ADMIN: 'TENANT_ADMIN',
  STAFF: 'STAFF',
  MEMBER: 'MEMBER',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

// Schema reads from const — single source
export const UserRoleSchema = z.enum(
  Object.values(USER_ROLE) as [UserRole, ...UserRole[]],
);
```

### DomainError abstract class signature

```typescript
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
// Note: message is set by subclasses (this.message = '...')
// Note: no framework imports — pure TypeScript
```

---

## Testing Strategy

| Layer | What to Test                                                                                                         | Approach                                                                      |
| ----- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Unit  | `BaseEntitySchema` / `TenantedEntitySchema` parse valid + invalid payloads                                           | Vitest — `schema.safeParse()` assertions, happy path + missing/invalid fields |
| Unit  | Each entity schema (Tenant, User, Member, BusinessUnit) validates required fields and rejects invalid roles/statuses | Vitest — one `describe` per schema, `it.each` for field combos                |
| Unit  | `apiResponseSchema` and `paginatedResponseSchema` factories produce correct shapes                                   | Vitest — instantiate with primitive inner schema                              |
| Unit  | `DomainError` subclasses: `instanceof DomainError` passes, `code` matches `DOMAIN_ERROR_TYPE`                        | Vitest — `expect(err).toBeInstanceOf(DomainError)`                            |
| Unit  | `DomainValidationError.fromZod(zodError)` preserves issues in `context`                                              | Vitest — parse an intentionally invalid payload, capture ZodError, wrap       |
| Build | Zero TS errors, zero lint errors after tsconfig change                                                               | `nx build shared-types` + `nx lint shared-types`                              |

Tests are co-located as `*.spec.ts` inside the relevant folder (e.g., `src/user/user.schema.spec.ts`).

---

## Migration / Rollout

No migration required. `@saas/shared-types` has zero current consumers (the lib is a placeholder). The placeholder files (`src/lib/shared-types.ts`, `src/lib/shared-types.spec.ts`) are deleted as part of this change. The barrel entry point (`src/index.ts`) is rewritten.

The `zod` workspace dependency is additive — no existing code is affected.

---

## Open Questions

- [ ] **Tenant plan field type**: Should `TenantSchema.plan` be `z.string()` (free-form) or `z.enum(Object.values(TENANT_PLAN))` with a co-located `TENANT_PLAN` const? Lean toward `enum` if billing/Stripe plans are known at this stage.
- [ ] **`CreateUserSchema` scope**: Should mutation schemas (`CreateUserSchema`, `UpdateUserSchema`) live in `shared-types` or in `auth-service` local DTOs? Shared only if the api-gateway constructs the create-user payload directly. Recommend deferring mutation schemas to service-local DTOs unless api-gateway needs them.
