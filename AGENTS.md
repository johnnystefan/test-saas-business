# AGENTS.md — SaaS Business Platform

## How to Use This Guide

- This is the **root orchestrator** for AI agents in this monorepo.
- Each app/lib has its own `AGENTS.md` with component-specific guidelines.
- Component docs override this file when guidance conflicts.
- Skills provide detailed patterns — always load the relevant skill BEFORE writing code.

---

## Available Skills

> Load skills on-demand using the skill tool. Component-level skills take precedence over generic ones.

### Generic Skills (Any Component)

| Skill                 | Description                                                                                      | File                                         |
| --------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| `typescript`          | Strict mode, const types, flat interfaces, Linus rules, declarative naming, RO-RO, guard clauses | [SKILL.md](skills/typescript/SKILL.md)       |
| `react-19`            | Functional components, Container/Presentational, React Query, RHF, code splitting                | [SKILL.md](skills/react-19/SKILL.md)         |
| `nestjs`              | One-controller-per-action, Provider pattern, DI tokens, circular dep prevention                  | [SKILL.md](skills/nestjs/SKILL.md)           |
| `nestjs-domain`       | Entity, Value Object, pure Use Case, Repository interface (DDD)                                  | [SKILL.md](skills/nestjs-domain/SKILL.md)    |
| `domain-errors`       | DomainError base class, error codes, exception filter mapping                                    | [SKILL.md](skills/domain-errors/SKILL.md)    |
| `testing-patterns`    | Object Mothers, AAA pattern, coverage requirements, Given-When-Then                              | [SKILL.md](skills/testing-patterns/SKILL.md) |
| `nx-monorepo`         | Workspace conventions, lib boundaries, generators                                                | [SKILL.md](skills/nx-monorepo/SKILL.md)      |
| `prisma`              | Schema design, migrations, query patterns, relations                                             | [SKILL.md](skills/prisma/SKILL.md)           |
| `zod-4`               | Schema validation, safeParse, createZodDto for NestJS, response validation                       | [SKILL.md](skills/zod-4/SKILL.md)            |
| `zustand-5`           | Store slices, selectors, persist middleware, project naming conventions                          | [SKILL.md](skills/zustand-5/SKILL.md)        |
| `vitest`              | Unit + integration tests for React components and hooks                                          | [SKILL.md](skills/vitest/SKILL.md)           |
| `polyglot-test-agent` | Multi-language backend test generation pipeline                                                  | [SKILL.md](skills/jest/SKILL.md)             |
| `playwright`          | E2E testing, Page Object Model, selectors                                                        | [SKILL.md](skills/playwright/SKILL.md)       |
| `tdd`                 | Test-Driven Development: RED → GREEN → REFACTOR                                                  | [SKILL.md](skills/tdd/SKILL.md)              |
| `skill-creator`       | Create new AI agent skills for this project                                                      | [SKILL.md](skills/skill-creator/SKILL.md)    |
| `skill-sync`          | Sync skill metadata to AGENTS.md Auto-invoke tables                                              | [SKILL.md](skills/skill-sync/SKILL.md)       |

### Project-Specific Skills

| Skill               | Description                                                  | File                                          |
| ------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| `saas-architecture` | Monorepo structure, NX boundaries, BFF pattern, multi-tenant | [SKILL.md](skills/saas-architecture/SKILL.md) |
| `saas-admin`        | Admin dashboard conventions (React + NestJS)                 | [SKILL.md](skills/saas-admin/SKILL.md)        |
| `saas-customer-app` | Customer app conventions (React + Capacitor)                 | [SKILL.md](skills/saas-customer-app/SKILL.md) |
| `saas-auth`         | JWT + Refresh Tokens + RBAC implementation                   | [SKILL.md](skills/saas-auth/SKILL.md)         |
| `saas-payments`     | Stripe integration (subscriptions + one-time payments)       | [SKILL.md](skills/saas-payments/SKILL.md)     |
| `saas-realtime`     | WebSocket gateways for reservations and live availability    | [SKILL.md](skills/saas-realtime/SKILL.md)     |
| `saas-api-gateway`  | BFF patterns, aggregation, route delegation                  | [SKILL.md](skills/saas-api-gateway/SKILL.md)  |
| `saas-domain`       | Domain models, business rules per business unit              | [SKILL.md](skills/saas-domain/SKILL.md)       |

---

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action                                               | Skill                 |
| ---------------------------------------------------- | --------------------- |
| After creating/modifying a skill                     | `skill-sync`          |
| Creating new skills                                  | `skill-creator`       |
| Creating Zod schemas or validators                   | `zod-4`               |
| Creating or modifying Zustand stores                 | `zustand-5`           |
| Creating NestJS modules, guards, interceptors, pipes | `nestjs`              |
| Creating NX libs, apps, or generators                | `nx-monorepo`         |
| Creating Prisma models or migrations                 | `prisma`              |
| Writing React components or hooks                    | `react-19`            |
| Writing TypeScript types/interfaces                  | `typescript`          |
| Writing unit or integration tests (React/frontend)   | `vitest`              |
| Writing unit or integration tests (NestJS/backend)   | `polyglot-test-agent` |
| Writing E2E tests                                    | `playwright`          |
| Implementing a feature or fixing a bug               | `tdd`                 |
| Refactoring code                                     | `tdd`                 |
| Working on admin dashboard                           | `saas-admin`          |
| Working on customer app or mobile                    | `saas-customer-app`   |
| Working on auth (JWT, RBAC, guards)                  | `saas-auth`           |
| Working on payments or Stripe                        | `saas-payments`       |
| Working on WebSockets or real-time                   | `saas-realtime`       |
| Working on API Gateway / BFF                         | `saas-api-gateway`    |
| Working on domain models or business rules           | `saas-domain`         |
| Defining monorepo structure or NX boundaries         | `saas-architecture`   |
| Regenerate AGENTS.md Auto-invoke tables              | `skill-sync`          |

---

## Project Overview

A multi-tenant SaaS platform for sports business management — starting with baseball, designed to scale to any sports academy, gym, or training center.

| Component         | Location                  | Tech Stack                                 |
| ----------------- | ------------------------- | ------------------------------------------ |
| Admin Dashboard   | `apps/admin/`             | React 19, TypeScript, Zustand, React Query |
| Customer App      | `apps/customer/`          | React 19, TypeScript, Capacitor (mobile)   |
| API Gateway (BFF) | `apps/api-gateway/`       | NestJS, TypeScript                         |
| Auth Service      | `apps/auth-service/`      | NestJS, JWT, Prisma, PostgreSQL            |
| Club Service      | `apps/club-service/`      | NestJS, Prisma, PostgreSQL                 |
| Inventory Service | `apps/inventory-service/` | NestJS, Prisma, PostgreSQL                 |
| Booking Service   | `apps/booking-service/`   | NestJS, WebSockets, Prisma, PostgreSQL     |
| Finance Service   | `apps/finance-service/`   | NestJS, Prisma, PostgreSQL                 |
| Shared Libraries  | `libs/`                   | TypeScript, Zod schemas, shared types      |

---

## Tech Stack

| Layer                   | Technology                     | Version                                         |
| ----------------------- | ------------------------------ | ----------------------------------------------- |
| Monorepo                | NX                             | latest                                          |
| Language                | TypeScript                     | **6 (beta)** — `npm install -D typescript@beta` |
| Frontend                | React                          | 19 (latest stable)                              |
| Backend                 | NestJS                         | latest stable                                   |
| ORM                     | Prisma                         | latest stable                                   |
| Database                | PostgreSQL                     | 16+                                             |
| State (client)          | Zustand                        | **5**                                           |
| State (server)          | React Query (TanStack)         | latest                                          |
| Validation              | Zod                            | **4**                                           |
| Mobile                  | Capacitor                      | latest                                          |
| Auth                    | JWT + Refresh Tokens           | —                                               |
| Payments                | Stripe                         | latest                                          |
| Real-time               | WebSockets (NestJS Gateways)   | —                                               |
| Testing (unit/frontend) | Vitest + React Testing Library | latest                                          |
| Testing (unit/backend)  | Jest (via polyglot-test-agent) | latest                                          |
| Testing (E2E)           | Playwright                     | latest                                          |
| Logging                 | Winston                        | latest                                          |
| Observability           | OpenTelemetry                  | latest                                          |
| Containers              | Docker                         | latest                                          |
| CI/CD                   | GitHub Actions                 | —                                               |

---

## Naming Conventions

| Element                      | Convention         | Example                      |
| ---------------------------- | ------------------ | ---------------------------- |
| Files                        | `kebab-case`       | `user-repository.ts`         |
| Classes / Interfaces / Types | `PascalCase`       | `UserRepository`             |
| Variables / Functions        | `camelCase`        | `getUserById`                |
| Global constants             | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT`            |
| NX app names                 | `kebab-case`       | `admin`, `club-service`      |
| NX lib names                 | `kebab-case`       | `shared-types`, `auth-utils` |
| Database tables              | `snake_case`       | `business_units`             |
| Env variables                | `UPPER_SNAKE_CASE` | `DATABASE_URL`               |

---

## Architecture Rules

### NX Monorepo Boundaries

```
apps/        → Entry points only. No business logic here.
libs/        → All shared logic: types, utils, UI components, domain models.

libs/
├── shared/
│   ├── types/        → Zod schemas + inferred TypeScript types
│   ├── utils/        → Pure utility functions
│   └── ui/           → Shared React components (design system)
├── auth/
│   └── utils/        → JWT helpers, token utilities
└── domain/
    └── [module]/     → Domain models and interfaces per business unit
```

- `apps/` MUST NOT import from other `apps/`
- `apps/` MAY import from `libs/`
- `libs/` MUST NOT import from `apps/`
- Shared types MUST be defined in `libs/shared/types/` using Zod schemas

### Backend (NestJS) Rules

- Controllers: **delegate only** — no business logic, no queries
- Services: **business logic only** — no HTTP concerns
- Repository Pattern: **mandatory** — services never access Prisma directly
- DTOs: **always validated with Zod** (via `ZodValidationPipe`)
- Guards: **RBAC via decorators** — no inline permission checks
- Interceptors: **response transformation and logging**
- NEVER use `any` type — use `unknown` and narrow with Zod

### Frontend (React) Rules

- **Functional components only** — no class components
- **Container / Presentational pattern** — containers handle data, presentationals render
- **Custom hooks** for all reusable logic — never inline in components
- **Zustand** for client-side global state
- **React Query** for all server state (fetching, caching, mutations)
- **Zod** for all form validation (integrate with React Hook Form)
- NEVER use `useEffect` for data fetching — use React Query
- NEVER use prop drilling beyond 2 levels — use context or Zustand

### Database Rules

- **Prisma migrations** — never modify DB schema manually
- **snake_case** for all table and column names
- Every table MUST have: `id`, `created_at`, `updated_at`
- Multi-tenant isolation via `tenant_id` on all tenant-scoped tables
- NEVER expose raw database IDs in public APIs — use UUIDs

---

## Testing Standards

| Type            | Tool         | What to test                            |
| --------------- | ------------ | --------------------------------------- |
| Unit (frontend) | Vitest + RTL | React components, hooks, utilities      |
| Unit (backend)  | Jest         | Services, repositories, NestJS modules  |
| Integration     | Jest         | DB queries, module wiring, with test DB |
| E2E             | Playwright   | Critical user flows, full stack         |

- Test files: co-located with source as `*.spec.ts`
- E2E tests: `apps/[app]/e2e/`
- **TDD is the default workflow** — RED → GREEN → REFACTOR
- Every public function MUST have at least one test
- Every API endpoint MUST have an integration test

---

## Commit & PR Guidelines

Follow conventional commits: `<type>[scope]: <description>`

**Types:** `feat`, `fix`, `docs`, `chore`, `perf`, `refactor`, `style`, `test`

**Scopes:** `admin`, `customer`, `api-gateway`, `auth`, `club`, `inventory`, `booking`, `finance`, `shared`, `infra`

**Examples:**

```
feat(booking): add real-time slot availability via WebSocket
fix(auth): refresh token not rotating on concurrent requests
chore(infra): add Docker Compose for local development
test(club): add integration tests for student enrollment
```

Before creating a PR:

1. Run all tests: `nx run-many --target=test --all`
2. Run lint: `nx run-many --target=lint --all`
3. No `any` types, no console.logs in production code
4. Screenshots for UI changes
5. Never commit `.env` files

---

## CLI Tools (Prefer These)

| Tool           | Replaces | Install                |
| -------------- | -------- | ---------------------- |
| `bat`          | `cat`    | `brew install bat`     |
| `rg` (ripgrep) | `grep`   | `brew install ripgrep` |
| `fd`           | `find`   | `brew install fd`      |
| `eza`          | `ls`     | `brew install eza`     |
| `sd`           | `sed`    | `brew install sd`      |

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Serve apps
nx serve admin
nx serve customer
nx serve api-gateway

# Test
nx test [app-or-lib]
nx run-many --target=test --all

# Lint
nx lint [app-or-lib]
nx run-many --target=lint --all

# Build
nx build [app-or-lib]

# Generate new app
nx g @nx/react:app [name]
nx g @nx/nest:app [name]

# Generate new lib
nx g @nx/js:lib libs/[name]

# Sync skill metadata to AGENTS.md
./skills/skill-sync/assets/sync.sh
```

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
