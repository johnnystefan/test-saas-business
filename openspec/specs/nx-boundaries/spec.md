# NX Boundaries Specification

## Purpose

Define the import rules and tag taxonomy that enforce architecture constraints across the monorepo. These rules are enforced at lint-time via `@nx/enforce-module-boundaries`.

---

## Requirements

### Requirement: Project Tag Taxonomy

Every NX project MUST have tags from three axes: `scope`, `type`, and `platform`.

| Axis | Values |
|------|--------|
| `scope` | `admin`, `customer`, `shared`, `auth`, `club`, `inventory`, `booking`, `finance` |
| `type` | `app`, `bff`, `service`, `types`, `util`, `ui`, `domain`, `testing`, `constants` |
| `platform` | `web`, `web-mobile`, `node` |

#### Scenario: App tags are correctly set

- GIVEN the `admin` app is generated
- WHEN `cat apps/admin/project.json` is inspected
- THEN tags include `scope:admin`, `type:app`, `platform:web`

#### Scenario: Shared lib tags are correctly set

- GIVEN the `shared-types` lib is generated
- WHEN `cat libs/shared/types/project.json` is inspected
- THEN tags include `scope:shared`, `type:types`

---

### Requirement: Cross-App Import Prohibition

Apps MUST NOT import from other apps.

#### Scenario: Direct app-to-app import is blocked

- GIVEN `apps/admin` attempts to import from `apps/auth-service`
- WHEN `nx lint admin` is run
- THEN ESLint reports an `@nx/enforce-module-boundaries` violation
- AND the lint fails with a descriptive error

---

### Requirement: App-to-Lib Import Permission

Apps and BFFs MUST be able to import from libs with compatible tags.

#### Scenario: Frontend app imports shared types

- GIVEN `apps/admin` imports `@saas/shared-types`
- WHEN `nx lint admin` is run
- THEN no boundary violation is reported

#### Scenario: Backend service imports shared types

- GIVEN `apps/auth-service` imports `@saas/shared-types`
- WHEN `nx lint auth-service` is run
- THEN no boundary violation is reported

#### Scenario: Frontend app imports backend-only lib

- GIVEN `apps/admin` (platform:web) imports a lib tagged `platform:node`
- WHEN `nx lint admin` is run
- THEN ESLint reports a boundary violation

---

### Requirement: Scope Isolation Between Admin and Customer

Admin-scoped projects MUST NOT import from customer-scoped projects, and vice versa. Both MAY import from `scope:shared`.

#### Scenario: Admin imports customer-scoped lib

- GIVEN `apps/admin` (scope:admin) imports a lib tagged `scope:customer`
- WHEN `nx lint admin` is run
- THEN ESLint reports a boundary violation

#### Scenario: Both admin and customer import shared lib

- GIVEN `apps/admin` imports `@saas/shared-types` (scope:shared)
- AND `apps/customer` imports `@saas/shared-types` (scope:shared)
- WHEN `nx run-many --target=lint --projects=admin,customer` is run
- THEN both pass without boundary violations

---

### Requirement: Lib-to-App Import Prohibition

Libs MUST NOT import from apps.

#### Scenario: Lib imports from an app

- GIVEN `libs/shared/types` attempts to import from `apps/auth-service`
- WHEN `nx lint shared-types` is run
- THEN ESLint reports a boundary violation

---

### Requirement: UI Lib Platform Restriction

The `shared-ui` lib (platform:web) MUST NOT be imported by backend apps or services.

#### Scenario: Backend service imports UI lib

- GIVEN `apps/auth-service` (platform:node) imports from `libs/shared/ui`
- WHEN `nx lint auth-service` is run
- THEN ESLint reports a boundary violation

#### Scenario: Frontend app imports UI lib

- GIVEN `apps/admin` (platform:web) imports from `libs/shared/ui`
- WHEN `nx lint admin` is run
- THEN no boundary violation is reported
