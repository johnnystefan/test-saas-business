# Auth Service - AI Agent Ruleset

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

### Auth

- ALWAYS: JWT access token (short-lived) + refresh token (long-lived, rotated on use)
- ALWAYS: Store refresh tokens hashed in DB — never plain text
- NEVER: Store sensitive data in JWT payload — only `sub`, `role`, `tenantId`
- ALWAYS: RBAC via `@Roles()` decorator + `RolesGuard`
- NEVER: Inline permission checks in controllers or services

### Domain

- ALWAYS: Entities validate their own invariants
- NEVER: Prisma in domain layer — only in infrastructure/repositories
- ALWAYS: Repository interfaces in domain, implementations in infrastructure
- NEVER: `any` type — use `unknown` and narrow with Zod or guards

### Database

- ALWAYS: `snake_case` for all table/column names
- ALWAYS: UUID PKs — never expose sequential integer IDs
- ALWAYS: `tenant_id` on all tenant-scoped tables
