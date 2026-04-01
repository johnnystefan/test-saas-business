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
| `zod-4`               | Schema validation, safeParse, createZodDto for NestJS, response validation                       | [SKILL.md](skills/zod-4/SKILL.md)            |
| `zustand-5`           | Store slices, selectors, persist middleware, project naming conventions                          | [SKILL.md](skills/zustand-5/SKILL.md)        |
| `vitest`              | Unit + integration tests for React components and hooks                                          | [SKILL.md](skills/vitest/SKILL.md)           |
| `polyglot-test-agent` | Multi-language backend test generation pipeline                                                  | [SKILL.md](skills/jest/SKILL.md)             |
| `playwright`          | E2E testing, Page Object Model, selectors                                                        | [SKILL.md](skills/playwright/SKILL.md)       |
| `tdd`                 | Test-Driven Development: RED → GREEN → REFACTOR                                                  | [SKILL.md](skills/tdd/SKILL.md)              |
| `skill-creator`       | Create new AI agent skills for this project                                                      | [SKILL.md](skills/skill-creator/SKILL.md)    |
| `skill-sync`          | Sync skill metadata to AGENTS.md Auto-invoke tables                                              | [SKILL.md](skills/skill-sync/SKILL.md)       |

### NX Workspace Skills

| Skill                     | Description                                                                      | File                                                |
| ------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------- |
| `nx-generate`             | Scaffold apps/libs with NX generators; always invoke before creating any project | [SKILL.md](skills/nx-generate/SKILL.md)             |
| `nx-workspace`            | Explore workspace, query projects/targets/deps, debug nx task failures           | [SKILL.md](skills/nx-workspace/SKILL.md)            |
| `nx-run-tasks`            | Run build, test, lint, serve and any other NX targets                            | [SKILL.md](skills/nx-run-tasks/SKILL.md)            |
| `nx-plugins`              | Discover and install NX plugins for new frameworks or technologies               | [SKILL.md](skills/nx-plugins/SKILL.md)              |
| `nx-import`               | Import external repos or merge codebases into this NX monorepo                   | [SKILL.md](skills/nx-import/SKILL.md)               |
| `monitor-ci`              | Monitor NX Cloud CI pipeline and apply self-healing fixes                        | [SKILL.md](skills/monitor-ci/SKILL.md)              |
| `link-workspace-packages` | Link workspace packages when imports fail or new packages need wiring            | [SKILL.md](skills/link-workspace-packages/SKILL.md) |

### Fundamentals Skills

| Skill                   | Description                                                           | File                                                           |
| ----------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------- |
| `oop-pillars`           | Encapsulation, Abstraction, Inheritance, Polymorphism with examples   | [SKILL.md](skills/fundamentals/oop-pillars/SKILL.md)           |
| `oop-design-principles` | DRY, KISS, YAGNI, Law of Demeter, Composition over Inheritance        | [SKILL.md](skills/fundamentals/oop-design-principles/SKILL.md) |
| `solid-principles`      | Single Responsibility, Open/Closed, Liskov, Interface Segregation, DI | [SKILL.md](skills/fundamentals/solid-principles/SKILL.md)      |
| `object-relationships`  | Association, Aggregation, Composition, Dependency relationships       | [SKILL.md](skills/fundamentals/object-relationships/SKILL.md)  |

### Code Smells Skills

| Skill                    | Description                                                         | File                                                      |
| ------------------------ | ------------------------------------------------------------------- | --------------------------------------------------------- |
| `code-smells-bloaters`   | Long Method, Large Class, Primitive Obsession, Long Parameter List  | [SKILL.md](skills/code-smells/bloaters/SKILL.md)          |
| `code-smells-changers`   | Divergent Change, Shotgun Surgery, Parallel Inheritance Hierarchies | [SKILL.md](skills/code-smells/change-preventers/SKILL.md) |
| `code-smells-couplers`   | Feature Envy, Inappropriate Intimacy, Message Chains, Middle Man    | [SKILL.md](skills/code-smells/couplers/SKILL.md)          |
| `code-smells-dispens`    | Lazy Class, Speculative Generality, Dead Code, Duplicate Code       | [SKILL.md](skills/code-smells/dispensables/SKILL.md)      |
| `code-smells-oo-abusers` | Switch Statements, Temporary Field, Refused Bequest, Alt. Classes   | [SKILL.md](skills/code-smells/oo-abusers/SKILL.md)        |

### Refactoring Skills

| Skill                         | Description                                                        | File                                                             |
| ----------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `refactoring-composing`       | Extract Method, Inline Method, Replace Temp with Query             | [SKILL.md](skills/refactoring/composing-methods/SKILL.md)        |
| `refactoring-generalization`  | Pull Up / Push Down, Extract Interface, Collapse Hierarchy         | [SKILL.md](skills/refactoring/generalization/SKILL.md)           |
| `refactoring-moving-features` | Move Method/Field, Extract Class, Hide Delegate                    | [SKILL.md](skills/refactoring/moving-features/SKILL.md)          |
| `refactoring-organizing-data` | Replace Magic Number, Encapsulate Field, Replace Array with Object | [SKILL.md](skills/refactoring/organizing-data/SKILL.md)          |
| `refactoring-conditionals`    | Decompose Conditional, Replace Conditional with Polymorphism       | [SKILL.md](skills/refactoring/simplifying-conditionals/SKILL.md) |
| `refactoring-method-calls`    | Rename Method, Separate Query from Modifier, Parameterize Method   | [SKILL.md](skills/refactoring/simplifying-method-calls/SKILL.md) |
| `refactoring-strategy`        | When and how to apply refactoring systematically                   | [SKILL.md](skills/refactoring/strategy/SKILL.md)                 |

### Design Patterns — Behavioral

| Skill                             | Description                                                               | File                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `pattern-chain-of-responsibility` | Pass requests along a handler chain; each handler decides to process/pass | [SKILL.md](skills/design-patterns/behaviorals/pattern-chain-of-responsibility/SKILL.md) |
| `pattern-command`                 | Encapsulate requests as objects for queuing, logging, undo/redo           | [SKILL.md](skills/design-patterns/behaviorals/pattern-command.md/SKILL.md)              |
| `pattern-iterator`                | Sequential access to collection elements without exposing internals       | [SKILL.md](skills/design-patterns/behaviorals/pattern-iterator/SKILL.md)                |
| `pattern-mediator`                | Reduce coupling by routing communication through a central mediator       | [SKILL.md](skills/design-patterns/behaviorals/pattern-mediator/SKILL.md)                |
| `pattern-memento`                 | Capture and restore object state without breaking encapsulation           | [SKILL.md](skills/design-patterns/behaviorals/pattern-memento/SKILL.md)                 |
| `pattern-observer`                | Subscription mechanism to notify observers about state changes            | [SKILL.md](skills/design-patterns/behaviorals/pattern-observer.md/SKILL.md)             |
| `pattern-state`                   | Alter object behavior when its internal state changes                     | [SKILL.md](skills/design-patterns/behaviorals/pattern-state/SKILL.md)                   |
| `pattern-strategy`                | Define interchangeable algorithm families, swap at runtime                | [SKILL.md](skills/design-patterns/behaviorals/pattern-strategy/SKILL.md)                |
| `pattern-template-method`         | Define algorithm skeleton in superclass; subclasses override steps        | [SKILL.md](skills/design-patterns/behaviorals/pattern-template-method.md/SKILL.md)      |
| `pattern-visitor`                 | Add operations to stable class hierarchies without modifying them         | [SKILL.md](skills/design-patterns/behaviorals/pattern-visitor/SKILL.md)                 |

### Design Patterns — Creational

| Skill                      | Description                                                             | File                                                                      |
| -------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `pattern-abstract-factory` | Produce families of compatible related objects without concrete classes | [SKILL.md](skills/design-patterns/creationals/abstract-factory/SKILL.md)  |
| `pattern-factory-method`   | Decouple object creation; subclasses decide which class to instantiate  | [SKILL.md](skills/design-patterns/creationals/factory-method/SKILL.md)    |
| `pattern-builder`          | Construct complex objects step by step with a fluent interface          | [SKILL.md](skills/design-patterns/creationals/pattern-builder/SKILL.md)   |
| `pattern-prototype`        | Clone existing objects without depending on their concrete classes      | [SKILL.md](skills/design-patterns/creationals/pattern-prototype/SKILL.md) |
| `pattern-singleton`        | Ensure a class has only one instance with a global access point         | [SKILL.md](skills/design-patterns/creationals/pattern-singleton/SKILL.md) |

### Design Patterns — Structural

| Skill               | Description                                                        | File                                                                      |
| ------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `pattern-adapter`   | Wrap incompatible interfaces so objects can collaborate            | [SKILL.md](skills/design-patterns/structurals/pattern-adapter/SKILL.md)   |
| `pattern-bridge`    | Split abstraction and implementation into independent hierarchies  | [SKILL.md](skills/design-patterns/structurals/pattern-bridge/SKILL.md)    |
| `pattern-composite` | Compose objects into tree structures for part-whole hierarchies    | [SKILL.md](skills/design-patterns/structurals/pattern-composite/SKILL.md) |
| `pattern-decorator` | Add behaviors to objects dynamically via wrapper objects           | [SKILL.md](skills/design-patterns/structurals/pattern-decorator/SKILL.md) |
| `pattern-facade`    | Provide a simplified interface to a complex subsystem              | [SKILL.md](skills/design-patterns/structurals/pattern-facade/SKILL.md)    |
| `pattern-flyweight` | Share common state to minimize memory usage across many objects    | [SKILL.md](skills/design-patterns/structurals/pattern-flyweight/SKILL.md) |
| `pattern-proxy`     | Control object access with lazy loading, caching, or access guards | [SKILL.md](skills/design-patterns/structurals/pattern-proxy/SKILL.md)     |

### Documentation Skills

| Skill                      | Description                                               | File                                                               |
| -------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------ |
| `uml-documentation`        | Class, Component, Sequence, Use Case, Deployment diagrams | [SKILL.md](skills/documentation/uml-documentation/SKILL.md)        |
| `uml-interaction-diagrams` | Sequence, Collaboration, Timing, Interaction Overview     | [SKILL.md](skills/documentation/uml-interaction-diagrams/SKILL.md) |

### Technical Quality Skills

| Skill                       | Description                                                             | File                                                  |
| --------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------- |
| `technical-debt-management` | Identify, categorize, track, and systematically pay down technical debt | [SKILL.md](skills/technical-debt-management/SKILL.md) |
| `imcomplete-library-class`  | Extend third-party libraries safely without modifying their source      | [SKILL.md](skills/imcomplete-library-class/SKILL.md)  |

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

| Action | Skill |
|--------|-------|
| After creating/modifying a skill | `skill-sync` |
| Creating Zod schemas or validators | `zod-4` |
| Creating new skills | `skill-creator` |
| Designing class relationships or reviewing object lifecycle ownership | `fundamentals/object-relationships` |
| Designing extensible architecture or evaluating inheritance vs composition | `fundamentals/oop-design-principles` |
| Documenting architecture or class relationships with UML | `documentation/uml-documentation` |
| Documenting behavioral patterns or service interactions with sequence diagrams | `documentation/uml-interaction-diagrams` |
| Evaluating OOP design or replacing switch logic with polymorphism | `fundamentals/oop-pillars` |
| Extending third-party or read-only library classes | `imcomplete-library-class` |
| Fixing bug | `tdd` |
| Identifying or communicating technical debt and refactoring cost | `technical-debt-management` |
| Implementing feature | `tdd` |
| Modifying component | `tdd` |
| Monitoring CI pipeline or self-healing fixes | `monitor-ci` |
| Moving methods or fields between classes to improve cohesion | `refactoring/moving-features` |
| Planning a refactoring session or evaluating technical debt priority | `refactoring/strategy` |
| Refactoring class hierarchies or managing inheritance structures | `refactoring/generalization` |
| Refactoring code | `tdd` |
| Refactoring data structures or replacing primitives with domain objects | `refactoring/organizing-data` |
| Refactoring long methods or extracting variables and sub-methods | `refactoring/composing-methods` |
| Refactoring method signatures or separating queries from modifiers | `refactoring/simplifying-method-calls` |
| Refactoring nested conditionals or replacing type-based branching with polymorphism | `refactoring/simplifying-conditionals` |
| Regenerate AGENTS.md Auto-invoke tables | `skill-sync` |
| Reviewing OOP design and polymorphism usage | `code-smells/oo-abusers` |
| Reviewing architectural coupling and change patterns | `code-smells/change-preventers` |
| Reviewing code for size and complexity issues | `code-smells/bloaters` |
| Reviewing code for unnecessary elements and duplication | `code-smells/dispensables` |
| Reviewing coupling and class communication patterns | `code-smells/couplers` |
| Reviewing or applying SOLID principles to architecture or class design | `fundamentals/solid-principles` |
| Troubleshoot why a skill is missing from AGENTS.md auto-invoke | `skill-sync` |
| Working on task | `tdd` |
| Workspace package import errors or cannot find module (@org/*) | `link-workspace-packages` |
| Writing TypeScript types/interfaces | `typescript` |
| Writing unit or integration tests (NestJS/backend) | `polyglot-test-agent` |
| abstract factory pattern, product families, object creation | `pattern-abstract-factory` |
| adapter pattern, interface wrapper, legacy integration | `pattern-adapter` |
| bridge pattern, abstraction implementation split, platform independence | `pattern-bridge` |
| builder pattern, fluent builder, step by step construction | `pattern-builder` |
| chain of responsibility pattern, handler chain, middleware pipeline | `pattern-chain-of-responsibility` |
| command pattern, undo redo, action queue, request encapsulation | `pattern-command` |
| composite pattern, tree structure, part-whole hierarchy | `pattern-composite` |
| decorator pattern, dynamic behavior, wrapper object | `pattern-decorator` |
| facade pattern, simplified interface, subsystem abstraction | `pattern-facade` |
| factory method pattern, object creation, subclass instantiation | `pattern-factory-method` |
| flyweight pattern, shared state, memory optimization | `pattern-flyweight` |
| iterator pattern, collection traversal, custom iterator | `pattern-iterator` |
| mediator pattern, event bus, component decoupling | `pattern-mediator` |
| memento pattern, state snapshot, undo history | `pattern-memento` |
| observer pattern, pub sub, event driven, reactive updates | `pattern-observer` |
| prototype pattern, object cloning, copy constructor | `pattern-prototype` |
| proxy pattern, access control, lazy loading, virtual proxy | `pattern-proxy` |
| singleton pattern, single instance, global access point | `pattern-singleton` |
| state pattern, finite state machine, workflow states | `pattern-state` |
| strategy pattern, interchangeable algorithms, runtime behavior swap | `pattern-strategy` |
| template method pattern, algorithm skeleton, hook methods | `pattern-template-method` |
| visitor pattern, double dispatch, object structure operations | `pattern-visitor` |

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

- Test files: **co-located with source** as `*.spec.ts` — same directory as the file under test
- E2E tests: `apps/[app]/e2e/` — only for real end-to-end flows with the app running
- **TDD is the default workflow** — RED → GREEN → REFACTOR
- Every public function MUST have at least one test
- Every API endpoint MUST have an integration test
- **Atomic commits**: implementation + spec travel together in the same commit whenever possible
  - Acceptable: `feat(auth): add login provider` (spec in a follow-up `test(auth):` commit)
  - Not acceptable: merging to main without any spec coverage for the feature

> **Note for the GGA pre-commit hook**: see `GGA_RULES.md` for what the hook enforces.
> Missing specs are a WARNING (not a blocker) at commit time — coverage is enforced at PR level.

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
