# Workspace Specification

## Purpose

Define the NX monorepo workspace structure: apps, libs, TypeScript configuration, and local development environment.

---

## Requirements

### Requirement: NX Workspace Init

The workspace MUST be initialized with NX, pnpm as package manager, and TypeScript 6 (beta).

#### Scenario: Workspace is initialized

- GIVEN a clean directory
- WHEN the NX workspace is created with pnpm and TypeScript 6
- THEN `package.json` exists with `nx` and `typescript@beta` as devDependencies
- AND `pnpm-workspace.yaml` declares `apps/*` and `libs/*` as packages
- AND `nx.json` exists with `affected` and `cacheableOperations` configured

---

### Requirement: App Scaffolding

The workspace MUST contain exactly these apps, each as an independent NX project:

| App | Generator | Platform |
|-----|-----------|----------|
| `admin` | `@nx/react:app` | Web |
| `customer` | `@nx/react:app` | Web + Mobile |
| `api-gateway` | `@nx/nest:app` | Node |
| `admin-gateway` | `@nx/nest:app` | Node |
| `auth-service` | `@nx/nest:app` | Node |
| `club-service` | `@nx/nest:app` | Node |
| `inventory-service` | `@nx/nest:app` | Node |
| `booking-service` | `@nx/nest:app` | Node |
| `finance-service` | `@nx/nest:app` | Node |

#### Scenario: All apps are generated

- GIVEN the workspace is initialized
- WHEN all app generators are run
- THEN `apps/` contains exactly the 9 folders listed above
- AND each app has a `project.json` with its corresponding NX tags
- AND `nx show projects` lists all 9 apps

#### Scenario: Each app builds independently

- GIVEN an app is scaffolded
- WHEN `nx build {app}` is run
- THEN the build succeeds with zero TypeScript errors

---

### Requirement: Lib Scaffolding

The workspace MUST contain these initial libs:

| Lib | Path | Generator | Purpose |
|-----|------|-----------|---------|
| `shared-types` | `libs/shared/types` | `@nx/js:lib` | Zod schemas + inferred TS types |
| `shared-utils` | `libs/shared/utils` | `@nx/js:lib` | Pure utility functions |
| `shared-ui` | `libs/shared/ui` | `@nx/react:lib` | Design system components |
| `shared-constants` | `libs/shared/constants` | `@nx/js:lib` | Global UPPER_SNAKE_CASE constants |
| `auth-utils` | `libs/auth/utils` | `@nx/js:lib` | JWT helpers, token utilities |
| `testing-utils` | `libs/testing/utils` | `@nx/js:lib` | Mock factories, test helpers |
| `config-env` | `libs/config/env` | `@nx/js:lib` | Zod env schema + config loader |

#### Scenario: All libs are generated

- GIVEN the workspace is initialized
- WHEN all lib generators are run
- THEN `libs/` contains the 7 folders listed above
- AND each lib exports from a single `src/index.ts` barrel file
- AND `nx show projects` lists all 7 libs

---

### Requirement: TypeScript Path Aliases

The root `tsconfig.base.json` MUST declare path aliases for all libs using the `@saas/` prefix.

#### Scenario: Path alias resolves correctly

- GIVEN `tsconfig.base.json` declares `"@saas/shared-types": ["libs/shared/types/src/index.ts"]`
- WHEN an app imports `import { SlotSchema } from "@saas/shared-types"`
- THEN TypeScript resolves the import without error
- AND `nx lint {app}` passes

#### Scenario: Alias is missing for a lib

- GIVEN a new lib is created but its path alias is NOT added to `tsconfig.base.json`
- WHEN an app tries to import from that lib using `@saas/` prefix
- THEN TypeScript reports a "Cannot find module" error

---

### Requirement: TypeScript 6 Configuration

Every `tsconfig.json` in the workspace MUST comply with TypeScript 6 requirements.

#### Scenario: Backend tsconfig is valid

- GIVEN an NestJS app `tsconfig.json`
- THEN it MUST NOT use `moduleResolution: "node"` (deprecated)
- AND it MUST NOT use `outFile`
- AND it MUST declare `"types": ["node"]` explicitly
- AND it MUST declare `"rootDir": "./src"` explicitly

#### Scenario: Frontend tsconfig is valid

- GIVEN a React app `tsconfig.json`
- THEN it MUST use `moduleResolution: "bundler"`
- AND it MUST use `jsx: "react-jsx"`
- AND it MUST NOT use `target: "es5"`

---

### Requirement: Local Development Environment

The workspace MUST provide a `docker-compose.yml` for local development.

#### Scenario: PostgreSQL starts correctly

- GIVEN Docker Desktop is running
- WHEN `docker compose up -d` is run
- THEN a PostgreSQL 16 container starts on port `5432`
- AND the database is accessible with credentials from `.env.example`

#### Scenario: Missing .env file

- GIVEN `.env` does not exist
- WHEN a developer runs `docker compose up`
- THEN `docker-compose.yml` uses default values from `.env.example` as fallback
- AND a warning is displayed instructing to copy `.env.example` to `.env`
