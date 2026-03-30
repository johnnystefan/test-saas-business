# GGA Review Rules — Pre-commit Code Quality

> These rules apply to the **Gentleman Guardian Angel** pre-commit hook.
> Scope: staged files only. The GGA reviews code quality in the diff — not project-wide coverage.

---

## What the GGA MUST block (CRITICAL)

These are hard violations. Reject the commit if any are found in staged files.

### TypeScript Quality

- `any` type — use `unknown` and narrow with Zod
- Double cast (`as unknown as X`) — use proper types or Zod parse
- `require()` syntax — use `import` / `await import()` for dynamic imports
- Unused variables or parameters (use `_prefix` convention if intentionally unused)
- Missing explicit return types on public methods and functions

### Architecture Violations

- Business logic inside a Controller (controllers delegate only)
- Direct Prisma access inside a Use Case or Service (use repository interface)
- `tenantId` in request DTOs — must be extracted from JWT payload
- Import from another `apps/*` package (cross-app imports forbidden)
- Import from `apps/*` inside `libs/*`

### Security

- Hardcoded secrets, tokens, or passwords
- `console.log` in production code (use logger)
- `.env` file staged for commit

### NestJS Patterns

- JWT_SECRET or other env vars accessed without `requireEnv()` guard
- Raw `process.env.X` without validation in strategy/config files

---

## What the GGA SHOULD flag but NOT block (MEDIUM — warn only)

These are suggestions. Report them but allow the commit to pass.

- Missing spec file for a staged implementation file
  > Rationale: specs may arrive in a follow-up atomic commit. TDD is the goal,
  > but blocking every commit without a co-located spec creates friction.
- Emoji in log messages (inconsistent with service logging style)
- `PrismaService` registered directly in a feature module instead of a shared `PrismaModule`
- Magic strings/numbers that should be constants

---

## What the GGA must NOT flag (out of scope)

- Spec files themselves (already excluded via EXCLUDE_PATTERNS)
- Missing specs for files NOT in the current staged diff
- Generated files (`*.d.ts`, `prisma/generated/**`)
- Config files (`jest.config.ts`, `tsconfig*.json`, `project.json`)
- E2E test setup files

---

## Commit Message Format

Enforce conventional commits: `<type>[scope]: <description>`

**Valid types:** `feat`, `fix`, `docs`, `chore`, `perf`, `refactor`, `style`, `test`

**Valid scopes:** `admin`, `customer`, `api-gateway`, `auth`, `club`, `inventory`, `booking`, `finance`, `shared`, `infra`

Reject commits with:

- No conventional commit type prefix
- Scope not in the valid list above
- Empty description
