# Tasks: shared-types

## Phase 1: Infrastructure & Config

- [x] 1.1 Add `zod` to workspace root `package.json` as a `dependency` (run `pnpm add zod`)
- [x] 1.2 Add `zod` as `peerDependency` in `libs/shared/types/package.json`
- [x] 1.3 Update `libs/shared/types/tsconfig.json`: set `module: "esnext"` and `moduleResolution: "bundler"`, remove node16 config
- [x] 1.4 Delete placeholder files: `libs/shared/types/src/lib/shared-types.ts` and `libs/shared/types/src/lib/shared-types.spec.ts`

## Phase 2: Base Schemas

- [x] 2.1 Create `libs/shared/types/src/base/base-entity.schema.ts` — `BaseEntitySchema` (id uuid, createdAt/updatedAt `z.iso.datetime()`) and `TenantedEntitySchema` (`.extend({ tenantId: z.string().uuid() })`)
- [x] 2.2 Create `libs/shared/types/src/base/index.ts` — re-export all from base/

## Phase 3: Error Infrastructure

- [x] 3.1 Create `libs/shared/types/src/errors/domain-error.ts` — `DOMAIN_ERROR_TYPE as const`, `DomainErrorCode` inferred type, `DomainErrorContext`, `DomainError` abstract class extending `Error`
- [x] 3.2 Create `libs/shared/types/src/errors/domain-validation.error.ts` — `DomainValidationError` with static `fromZod(zodError)` factory
- [x] 3.3 Create `libs/shared/types/src/errors/invalid-argument.error.ts` — `InvalidArgumentError extends DomainError`
- [x] 3.4 Create `libs/shared/types/src/errors/business-rule-violation.error.ts` — `BusinessRuleViolationError extends DomainError`
- [x] 3.5 Create `libs/shared/types/src/errors/index.ts` — re-export all from errors/

## Phase 4: Entity Schemas

- [x] 4.1 Create `libs/shared/types/src/tenant/tenant.schema.ts` — `TenantSchema` (extends `BaseEntitySchema`), `TenantPrimitives` inferred type
- [x] 4.2 Create `libs/shared/types/src/tenant/index.ts` — re-export all from tenant/
- [x] 4.3 Create `libs/shared/types/src/user/user-role.const.ts` — `USER_ROLE as const`, `UserRole` inferred type, `UserRoleSchema` via `z.enum(Object.values(USER_ROLE))`
- [x] 4.4 Create `libs/shared/types/src/user/user.schema.ts` — `UserSchema` (extends `TenantedEntitySchema`), `UserPrimitives` inferred type
- [x] 4.5 Create `libs/shared/types/src/user/index.ts` — re-export all from user/
- [x] 4.6 Create `libs/shared/types/src/member/member-status.const.ts` — `MEMBER_STATUS as const`, `MemberStatus` inferred type
- [x] 4.7 Create `libs/shared/types/src/member/member.schema.ts` — `MemberSchema` (extends `TenantedEntitySchema`), optional `email`/`phone`, `enrolledAt` as `z.iso.datetime()`, `MemberPrimitives`
- [x] 4.8 Create `libs/shared/types/src/member/index.ts` — re-export all from member/
- [x] 4.9 Create `libs/shared/types/src/business-unit/business-unit-type.const.ts` — `BUSINESS_UNIT_TYPE as const`, `BusinessUnitType` inferred type
- [x] 4.10 Create `libs/shared/types/src/business-unit/business-unit.schema.ts` — `BusinessUnitSchema` (extends `TenantedEntitySchema`), `isActive: z.boolean()`, `BusinessUnitPrimitives`
- [x] 4.11 Create `libs/shared/types/src/business-unit/index.ts` — re-export all from business-unit/

## Phase 5: Common / Generic Schemas

- [x] 5.1 Create `libs/shared/types/src/common/api-response.schema.ts` — `apiResponseSchema<T>()` and `paginatedResponseSchema<T>()` factory functions, `PaginationInputSchema`
- [x] 5.2 Create `libs/shared/types/src/common/index.ts` — re-export all from common/

## Phase 6: Root Barrel

- [x] 6.1 Rewrite `libs/shared/types/src/index.ts` — re-export everything from base/, errors/, tenant/, user/, member/, business-unit/, common/

## Phase 7: Tests

- [x] 7.1 Create `libs/shared/types/src/base/base-entity.schema.spec.ts` — `safeParse` happy path (valid uuid + ISO strings) and failure cases (missing id, non-uuid, non-ISO timestamp); covers `TenantedEntitySchema` missing/invalid `tenantId`
- [x] 7.2 Create `libs/shared/types/src/errors/domain-error.spec.ts` — `instanceof DomainError` check on each concrete error, `code` matches `DOMAIN_ERROR_TYPE`, `DomainValidationError.fromZod()` preserves issues in context
- [x] 7.3 Create `libs/shared/types/src/user/user.schema.spec.ts` — valid user passes, unknown role fails, type inference sanity (`UserPrimitives`)
- [x] 7.4 Create `libs/shared/types/src/member/member.schema.spec.ts` — full member passes, minimal member (no email/phone) passes, invalid status fails
- [x] 7.5 Create `libs/shared/types/src/business-unit/business-unit.schema.spec.ts` — valid payload passes, invalid `type` fails
- [x] 7.6 Create `libs/shared/types/src/tenant/tenant.schema.spec.ts` — valid tenant passes, missing required fields fail
- [x] 7.7 Create `libs/shared/types/src/common/api-response.schema.spec.ts` — `apiResponseSchema(z.string())` and `paginatedResponseSchema(z.number())` return correct shapes

## Phase 8: Quality Gate

- [x] 8.1 Run `pnpm nx typecheck shared-types` (or `nx build shared-types`) — zero TypeScript errors
- [x] 8.2 Run `pnpm nx lint shared-types` — zero lint errors
- [x] 8.3 Run `pnpm nx test shared-types` — all spec scenarios green
