# Booking Service - AI Agent Ruleset

> **Skills Reference**: For detailed patterns, use these skills:
>
> - [`nestjs`](../../skills/nestjs/SKILL.md) - NestJS modules, controllers, guards, interceptors
> - [`nestjs-domain`](../../skills/nestjs-domain/SKILL.md) - DDD entities, value objects, use cases, repository interfaces
> - [`domain-errors`](../../skills/domain-errors/SKILL.md) - DomainError patterns and HTTP error mapping
> - [`zod-4`](../../skills/zod-4/SKILL.md) - Request/response validation schemas
> - [`typescript`](../../skills/typescript/SKILL.md) - Strict mode, const types, flat interfaces
> - [`testing-patterns`](../../skills/testing-patterns/SKILL.md) - Object Mothers, AAA pattern
> - [`tdd`](../../skills/tdd/SKILL.md) - TDD workflow (MANDATORY for all tasks)

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| Building Node.js REST APIs or middleware pipelines outside NestJS | `nodejs-backend-patterns` |
| Building type-safe API clients or form validation systems | `typescript-advanced` |
| Creating NestJS modules, guards, interceptors, pipes | `nestjs` |
| Creating Zod schemas or validators | `zod-4` |
| Creating type-safe utilities, mapped types, or template literal types | `typescript-advanced` |
| Designing async patterns, security, or deployment for Node.js services | `nodejs-best-practices` |
| Fixing bug | `tdd` |
| Implementing NestJS microservices or database optimization | `nestjs-best-practices` |
| Implementing authentication or error handling at the Node.js level | `nodejs-backend-patterns` |
| Implementing complex TypeScript generics or conditional types | `typescript-advanced` |
| Implementing feature | `tdd` |
| Making Node.js architecture or framework selection decisions | `nodejs-best-practices` |
| Modifying component | `tdd` |
| Refactoring NestJS modules or services for production readiness | `nestjs-best-practices` |
| Refactoring code | `tdd` |
| Reviewing NestJS architecture, DI patterns, or security | `nestjs-best-practices` |
| Running prisma migrate, prisma generate, or prisma db commands | `prisma-cli` |
| Setting up Prisma CLI or using prisma studio | `prisma-cli` |
| Setting up Prisma with a new database provider or connection string | `prisma-database-setup` |
| Setting up or provisioning Prisma Postgres databases | `prisma-postgres` |
| Troubleshooting Prisma database connection or provider configuration | `prisma-database-setup` |
| Using Prisma Client relations, filters, or pagination | `prisma-client-api` |
| Using Prisma Console, create-db CLI, or Management API SDK | `prisma-postgres` |
| Working on domain models or business rules | `domain-errors` |
| Working on domain models or business rules | `nestjs-domain` |
| Working on task | `tdd` |
| Workspace package import errors or cannot find module (@org/*) | `link-workspace-packages` |
| Writing Prisma queries, findMany, create, update, delete, or $transaction | `prisma-client-api` |
| Writing TypeScript types/interfaces | `typescript` |
| Writing unit or integration tests (NestJS/backend) | `polyglot-test-agent` |
| Writing unit or integration tests (React/frontend) | `testing-patterns` |

---

## CRITICAL RULES

### Domain

- Booking = scheduling slots for classes, courts, fields
- ALWAYS: Slot availability is a domain invariant — validate before persisting
- ALWAYS: Concurrent booking conflicts must be handled at domain level (optimistic locking)
- NEVER: Prisma in domain layer — only in infrastructure/repositories

### Real-time

- WebSocket Gateway for live slot availability updates
- ALWAYS: Emit events on booking created/cancelled/modified
- NEVER: Poll from client — push via WebSocket only

### NestJS

- Controllers: **delegate only** — no business logic
- Services: **orchestrate use cases only** — no direct DB queries
- NEVER: `any` type — use `unknown` and narrow with Zod

### Database

- ALWAYS: `snake_case` for all table/column names
- ALWAYS: UUID PKs
- ALWAYS: `tenant_id` on all tenant-scoped tables
- ALWAYS: `created_at` + `updated_at` on every table
