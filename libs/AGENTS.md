# Shared Libraries - AI Agent Ruleset

> **Skills Reference**: For detailed patterns, use these skills:
>
> - [`nestjs-domain`](../skills/nestjs-domain/SKILL.md) - DDD entities, value objects, use cases, repository interfaces
> - [`domain-errors`](../skills/domain-errors/SKILL.md) - DomainError patterns and HTTP error mapping
> - [`zod-4`](../skills/zod-4/SKILL.md) - Shared schemas and inferred TypeScript types
> - [`typescript`](../skills/typescript/SKILL.md) - Strict mode, const types, flat interfaces
> - [`testing-patterns`](../skills/testing-patterns/SKILL.md) - Object Mothers, AAA pattern
> - [`tdd`](../skills/tdd/SKILL.md) - TDD workflow (MANDATORY for all tasks)

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
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
| Writing unit or integration tests (React/frontend) | `testing-patterns` |

---

## CRITICAL RULES

### Boundaries

- `libs/` MUST NOT import from `apps/`
- `libs/shared/types/` — Zod schemas + inferred TypeScript types ONLY
- `libs/shared/utils/` — pure utility functions ONLY (no side effects)
- `libs/shared/ui/` — shared React components (design system) ONLY
- `libs/domain/[module]/` — domain models and interfaces per business unit

### Code Quality

- NEVER: `any` type anywhere in libs — these are consumed by all apps
- ALWAYS: Export only what's needed — no barrel exports of entire modules
- ALWAYS: Zod schemas as the single source of truth for types (`z.infer<typeof Schema>`)
- NEVER: Circular dependencies between libs
