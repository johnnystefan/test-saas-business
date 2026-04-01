# Admin Dashboard - AI Agent Ruleset

> **Skills Reference**: For detailed patterns, use these skills:
>
> - [`react-19`](../../skills/react-19/SKILL.md) - Functional components, Container/Presentational, React Query
> - [`zustand-5`](../../skills/zustand-5/SKILL.md) - Client state, store slices, selectors
> - [`zod-4`](../../skills/zod-4/SKILL.md) - Form validation, request/response schemas
> - [`typescript`](../../skills/typescript/SKILL.md) - Strict mode, const types, flat interfaces
> - [`vitest`](../../skills/vitest/SKILL.md) - Unit tests with React Testing Library
> - [`testing-patterns`](../../skills/testing-patterns/SKILL.md) - Object Mothers, AAA pattern
> - [`tdd`](../../skills/tdd/SKILL.md) - TDD workflow (MANDATORY for all tasks)

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| Creating Zod schemas or validators | `zod-4` |
| Creating or modifying Zustand stores | `zustand-5` |
| Fixing bug | `tdd` |
| Implementing feature | `tdd` |
| Modifying component | `tdd` |
| Refactoring code | `tdd` |
| Testing hooks or utilities | `vitest` |
| Working on task | `tdd` |
| Workspace package import errors or cannot find module (@org/*) | `link-workspace-packages` |
| Writing React component tests | `vitest` |
| Writing React components or hooks | `react-19` |
| Writing TypeScript types/interfaces | `typescript` |
| Writing Vitest tests | `vitest` |
| Writing unit or integration tests (React/frontend) | `testing-patterns` |
| Writing unit tests for UI | `vitest` |

---

## CRITICAL RULES

### React

- ALWAYS: `import { useState, useEffect } from "react"`
- NEVER: class components
- NEVER: `useEffect` for data fetching — use React Query
- NEVER: prop drilling beyond 2 levels — use Zustand or context
- ALWAYS: Container / Presentational pattern — containers handle data, presentationals render

### State

- React Query for ALL server state (fetching, caching, mutations)
- Zustand for ALL client-side global state
- Local `useState` only for truly local UI state (modals, toggles)

### Forms

- React Hook Form + Zod for ALL forms
- NEVER: uncontrolled inputs without RHF
