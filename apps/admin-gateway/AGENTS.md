# Admin Gateway (BFF) - AI Agent Ruleset

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
| Creating NestJS modules, guards, interceptors, pipes | `nestjs` |
| Workspace package import errors or cannot find module (@org/*) | `link-workspace-packages` |

---

## CRITICAL RULES

### BFF Pattern

- NEVER: Business logic in the gateway — delegate to microservices
- ALWAYS: Aggregate multiple microservice responses here, not in the admin frontend
- ALWAYS: One controller per route group — no fat controllers
- NEVER: Direct DB access — call downstream services only

### NestJS

- Controllers: **delegate only** — no business logic, no queries
- Guards: **RBAC via decorators** — no inline permission checks
- Interceptors: **response transformation and logging only**
- NEVER: `any` type — use `unknown` and narrow with Zod
