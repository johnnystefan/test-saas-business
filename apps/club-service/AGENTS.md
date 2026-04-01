# Club Service - AI Agent Ruleset

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
| Creating NestJS modules, guards, interceptors, pipes | `nestjs` |
| Creating Zod schemas or validators | `zod-4` |
| Fixing bug | `tdd` |
| Implementing feature | `tdd` |
| Modifying component | `tdd` |
| Refactoring code | `tdd` |
| Working on domain models or business rules | `domain-errors` |
| Working on domain models or business rules | `nestjs-domain` |
| Working on task | `tdd` |
| Workspace package import errors or cannot find module (@org/*) | `link-workspace-packages` |
| Writing TypeScript types/interfaces | `typescript` |
| Writing unit or integration tests (NestJS/backend) | `polyglot-test-agent` |
| Writing unit or integration tests (React/frontend) | `testing-patterns` |

---

## CRITICAL RULES

### Domain

- Club = root aggregate (tenants, sports academies, gyms)
- ALWAYS: Entities validate their own invariants (e.g. student enrollment limits)
- NEVER: Prisma in domain layer — only in infrastructure/repositories
- ALWAYS: Repository interfaces in domain, implementations in infrastructure

### NestJS

- Controllers: **delegate only** — no business logic
- Services: **orchestrate use cases only** — no direct DB queries
- NEVER: `any` type — use `unknown` and narrow with Zod

### Database

- ALWAYS: `snake_case` for all table/column names
- ALWAYS: UUID PKs — never expose sequential integer IDs
- ALWAYS: `tenant_id` on all tenant-scoped tables
- ALWAYS: `created_at` + `updated_at` on every table
