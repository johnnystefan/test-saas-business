# Proposal: shared-types

## Intent

Establish the foundational data contracts (Zod schemas and inferred types) that cross service boundaries. This ensures type safety between the frontend and backend without leaking business logic or framework dependencies.

## Scope

### In Scope

- Add `zod` (v4) to workspace root `package.json` and `shared-types` package.
- Fix `libs/shared/types/tsconfig.json` to use `moduleResolution: "bundler"`.
- Implement Zod schemas and inferred primitive types for: `BaseEntity`, `TenantedEntity`, `Tenant`, `User` (with `UserRole`), `Member`, and `BusinessUnit`.
- Implement generic schemas for `Pagination` and `ApiResponse<T>`.
- Implement the `DomainError` base class and `DOMAIN_ERROR_TYPE` constant map.
- Export all schemas and types cleanly from a single barrel file (`libs/shared/types/src/index.ts`).

### Out of Scope

- Value Objects, Repository interfaces, Use Cases, or any business behavior.
- Booking-specific primitives or full domain entities (deferred).
- Club/sport-specific types (e.g., baseball positions).
- Framework-specific code (e.g., NestJS decorators, exception filters).

## Approach

- **Zod as Source of Truth**: Define data shapes using Zod schemas and infer TypeScript types directly (`z.infer<typeof Schema>`).
- **Primitive Contracts**: Services will communicate using plain objects (`[Entity]Primitives`), keeping domain behavior strictly local to each service.
- **Zero-Framework**: Ensure `shared-types` remains pure TypeScript without Node.js or browser-specific dependencies, allowing universal consumption.
- **Co-location**: Constants (like `USER_ROLE` or `MEMBER_STATUS`) will be co-located with their respective Zod schemas.

## Affected Areas

| Area                              | Impact   | Description                                         |
| --------------------------------- | -------- | --------------------------------------------------- |
| `libs/shared/types/src/*`         | New      | Implement all schemas, constants, and error classes |
| `libs/shared/types/package.json`  | Modified | Declare `zod` dependency                            |
| `libs/shared/types/tsconfig.json` | Modified | Update `moduleResolution` to `"bundler"`            |
| `/package.json`                   | Modified | Add `zod` to workspace dependencies                 |

## Risks

| Risk                                        | Likelihood | Mitigation                                                                                                                              |
| ------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js primitives breaking frontend builds | Low        | Strictly restrict schemas to universal Zod primitives (string, date, uuid, number). No `Buffer` or platform-specific types.             |
| Domain logic leaking into shared space      | Low        | Enforce rule: `shared-types` contains only pure data shapes (primitives) and Zod schemas, no methods or classes (except `DomainError`). |

## Rollback Plan

Revert the commits modifying `libs/shared/types/src/`, restore the original `tsconfig.json` and `package.json` files, and remove the `zod` dependency from the workspace root if not required by other packages.

## Dependencies

- Requires installation of `zod` v4 in the workspace.

## Success Criteria

- [ ] `zod` v4 is installed and configured correctly.
- [ ] `libs/shared/types/tsconfig.json` is updated to use `"bundler"`.
- [ ] All specified schemas (Base, Tenant, User, Member, BusinessUnit) and API wrappers are implemented.
- [ ] Types are successfully inferred and exported.
- [ ] `DomainError` base class and constants are implemented.
- [ ] `libs/shared/types` builds successfully with zero TypeScript or linting errors.
