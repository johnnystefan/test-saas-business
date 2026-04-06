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
| Adding ARIA attributes or screen reader support | `accessibility` |
| Adding structured data or JSON-LD | `seo` |
| Auditing UI for WCAG compliance | `accessibility` |
| Building landing pages, dashboards, or marketing UI | `frontend-design` |
| Building libraries or SSR apps with Vite | `vite` |
| Building responsive layouts or design systems | `tailwind-css` |
| Building type-safe API clients or form validation systems | `typescript-advanced` |
| Configuring vite.config.ts or Vite plugins | `vite` |
| Creating Zod schemas or validators | `zod-4` |
| Creating or modifying Zustand stores | `zustand-5` |
| Creating type-safe utilities, mapped types, or template literal types | `typescript-advanced` |
| Designing UI components or pages with high aesthetic quality | `frontend-design` |
| Designing compound components or flexible component APIs | `react-composition` |
| Fixing bug | `tdd` |
| Fixing flaky Playwright tests or configuring Playwright CI/CD | `playwright` |
| Implementing accessible components or keyboard navigation | `accessibility` |
| Implementing complex TypeScript generics or conditional types | `typescript-advanced` |
| Implementing dark mode or Tailwind v4 features | `tailwind-css` |
| Implementing feature | `tdd` |
| Improving SEO or adding meta tags | `seo` |
| Migrating to Vite 8 or Rolldown bundler | `vite` |
| Mocking APIs, handling auth flows, or testing accessibility with Playwright | `playwright` |
| Modifying component | `tdd` |
| Optimizing React component performance or eliminating data fetching waterfalls | `react-performance` |
| Optimizing sitemap or robots.txt | `seo` |
| Reducing bundle size or implementing code splitting in React | `react-performance` |
| Refactoring React components with too many boolean props | `react-composition` |
| Refactoring code | `tdd` |
| Reviewing React code for re-render issues or async performance problems | `react-performance` |
| Styling React components with Tailwind CSS | `tailwind-css` |
| Styling or beautifying existing web UI | `frontend-design` |
| Testing hooks or utilities | `vitest` |
| Using React 19 composition patterns or context providers | `react-composition` |
| Working on task | `tdd` |
| Workspace package import errors or cannot find module (@org/*) | `link-workspace-packages` |
| Writing Playwright E2E tests or Page Object Model | `playwright` |
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
