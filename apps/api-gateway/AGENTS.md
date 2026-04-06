# API Gateway (BFF) - AI Agent Ruleset

> **Skills Reference**: For detailed patterns, use these skills:
>
> - [`saas-api-gateway`](../../skills/saas-api-gateway/SKILL.md) - BFF routing, aggregation, forwarding patterns
> - [`nestjs`](../../skills/nestjs/SKILL.md) - NestJS modules, controllers, guards, interceptors
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
| Working on API Gateway / BFF routing or aggregation | `saas-api-gateway` |
| Working on task | `tdd` |
| Workspace package import errors or cannot find module (@org/*) | `link-workspace-packages` |
| Writing TypeScript types/interfaces | `typescript` |
| Writing unit or integration tests (NestJS/backend) | `polyglot-test-agent` |
| Writing unit or integration tests (React/frontend) | `testing-patterns` |

---

## CRITICAL RULES

### BFF Pattern

- NEVER: Business logic in the gateway — delegate to microservices
- ALWAYS: Aggregate multiple microservice responses here, not in the frontend
- ALWAYS: One controller per route group — no fat controllers
- NEVER: Direct DB access — call downstream services only

### NestJS

- Controllers: **delegate only** — no business logic, no queries
- Guards: **RBAC via decorators** — no inline permission checks
- Interceptors: **response transformation and logging only**
- NEVER: `any` type — use `unknown` and narrow with Zod
