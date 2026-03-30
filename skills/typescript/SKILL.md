---
name: typescript
description: >
  TypeScript 6 strict patterns and best practices for this NX monorepo.
  Trigger: When implementing or refactoring TypeScript in .ts/.tsx (types, interfaces, generics, const maps, type guards, removing any, tightening unknown, declarative naming, RO-RO, guard clauses).
license: MIT
metadata:
  author: gentleman-programming
  version: '3.0'
  scope:
    [
      root,
      admin,
      customer,
      api-gateway,
      auth-service,
      club-service,
      inventory-service,
      booking-service,
      finance-service,
      libs,
    ]
  auto_invoke: 'Writing TypeScript types/interfaces'
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## Code Readability Philosophy (MANDATORY — applies to ALL business logic)

> **"A good story tells itself."**
> Business logic code must read like prose. If you need to pause to understand what a block does, rewrite it.

This philosophy applies to:

- Use cases, services, domain entities, repository implementations
- Custom hooks, containers, presentational helpers

This does **NOT** apply to:

- Framework config files (`tsconfig.json`, `project.json`, `prisma.config.ts`, `jest.config.cts`)
- NX/NestJS/React infrastructure boilerplate
- JSON schema files

### The Golden Rule: Separate WHAT from HOW

Public-facing methods (public, exported functions) describe **WHAT** the system does.
Private/internal methods describe **HOW** it does it.

```typescript
// ❌ BAD: Public method mixes WHAT and HOW
async login(dto: LoginDto): Promise<TokenPair> {
  const user = await this.userRepository.findByEmail(dto.email, dto.tenantId);
  if (!user) throw new UnauthorizedException('Invalid credentials');
  const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
  if (!isMatch) throw new UnauthorizedException('Invalid credentials');
  const payload = { sub: user.id, email: user.email, role: user.role, tenantId: user.tenantId };
  const accessToken = signAccessToken(payload, JWT_SECRET);
  const refreshToken = signRefreshToken(payload, JWT_SECRET);
  await this.userRepository.saveRefreshToken(user.id, refreshToken, getRefreshTokenExpiresAt());
  return { accessToken, refreshToken };
}

// ✅ GOOD: Public method tells the story, private methods do the work
async login(dto: LoginDto): Promise<TokenPair> {
  const result = await this.loginUseCase.execute(dto);
  const tokens = await this.issuedTokenPairFor(result);
  return tokens;
}

private async issuedTokenPairFor(result: LoginResult): Promise<TokenPair> {
  const payload = this.jwtPayload(result);
  const tokens = this.signedTokenPair(payload);
  await this.persistedRefreshToken(result.userId, tokens.refreshToken);
  return tokens;
}

private jwtPayload(result: LoginResult): JwtPayload { ... }
private signedTokenPair(payload: JwtPayload): TokenPair { ... }
private async persistedRefreshToken(userId: string, token: string): Promise<void> { ... }
```

### File Responsibility Separation

Each file has ONE clear responsibility. When a file starts doing multiple things, split it.

```
auth/
  auth.service.ts          → orchestration only (the WHAT)
  auth.service.helpers.ts  → pure helper functions used by the service
  auth.mapper.ts           → data transformations (entity ↔ dto ↔ response)
  auth.builder.ts          → object construction helpers
  auth.guard.ts            → access control
```

**Rule:** If you're scrolling to find where a function "fits" in a file, the file has too many responsibilities.

### Naming as Documentation

A well-named function makes its implementation obvious before you read it.

```typescript
// ❌ BAD: You have to read the body to know what it does
private process(data: LoginResult) { ... }
private handleToken(user: User, token: string) { ... }
private check(token: RefreshToken) { ... }

// ✅ GOOD: The name IS the documentation
private jwtPayload(result: LoginResult): JwtPayload { ... }
private persistedRefreshToken(userId: string, token: string): Promise<void> { ... }
private isTokenValid(token: RefreshToken): boolean { ... }
```

### Constants Over Magic Values

```typescript
// ❌ BAD: Magic numbers/strings buried in logic
const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
if (user.role === 'ADMIN') { ... }

// ✅ GOOD: Named constants that document intent
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
if (user.role === USER_ROLES.ADMIN) { ... }
```

### No Scrolling Rule

If you have to scroll within a single function to understand its full logic — it's too long. Extract.
This is not a strict line count — it's a readability test. Ask: _"Can I read this without scrolling?"_

---

## Const Types Pattern (REQUIRED)

```typescript
// ✅ ALWAYS: Create const object first, then extract type
const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];

// ❌ NEVER: Direct union types
type Status = 'active' | 'inactive' | 'pending';
```

**Why?** Single source of truth, runtime values, autocomplete, easier refactoring.

## Flat Interfaces (REQUIRED)

```typescript
// ✅ ALWAYS: One level depth, nested objects → dedicated interface
interface UserAddress {
  street: string;
  city: string;
}

interface User {
  id: string;
  name: string;
  address: UserAddress; // Reference, not inline
}

interface Admin extends User {
  permissions: string[];
}

// ❌ NEVER: Inline nested objects
interface User {
  address: { street: string; city: string }; // NO!
}
```

## Never Use `any`

```typescript
// ✅ Use unknown for truly unknown types
function parse(input: unknown): User {
  if (isUser(input)) return input;
  throw new Error('Invalid input');
}

// ✅ Use generics for flexible types
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// ❌ NEVER
function parse(input: any): any {}
```

## Utility Types

```typescript
Pick<User, 'id' | 'name'>; // Select fields
Omit<User, 'id'>; // Exclude fields
Partial<User>; // All optional
Required<User>; // All required
Readonly<User>; // All readonly
Record<string, User>; // Object type
Extract<Union, 'a' | 'b'>; // Extract from union
Exclude<Union, 'a'>; // Exclude from union
NonNullable<T | null>; // Remove null/undefined
ReturnType<typeof fn>; // Function return type
Parameters<typeof fn>; // Function params tuple
```

## Type Guards

```typescript
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}
```

## Coupled Optional Props (REQUIRED)

Do not model semantically coupled props as independent optionals — this allows invalid half-states that compile but break at runtime. Use discriminated unions with `never` to make invalid combinations impossible.

```typescript
// ❌ BEFORE: Independent optionals — half-states allowed
interface PaginationProps {
  onPageChange?: (page: number) => void;
  pageSize?: number;
  currentPage?: number;
}

// ✅ AFTER: Discriminated union — shape is all-or-nothing
type ControlledPagination = {
  controlled: true;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

type UncontrolledPagination = {
  controlled: false;
  currentPage?: never;
  pageSize?: never;
  onPageChange?: never;
};

type PaginationProps = ControlledPagination | UncontrolledPagination;
```

**Key rule:** If two or more props are only meaningful together, they belong to the same discriminated union branch. Mixing them as independent optionals shifts correctness responsibility from the type system to runtime guards.

## Import Types

```typescript
import type { User } from './types';
import { createUser, type Config } from './utils';
```

---

## Linus Torvalds' Rules (MANDATORY for ALL code)

1. **Keep it simple or don't do it** — If the solution is complex, rethink the problem
2. **Delete useless code without fear** — Dead code is technical debt, remove it immediately
3. **If you need comments, rewrite the code** — Comments are a code smell
4. **Never mix refactors with fixes** — One commit, one purpose
5. **If you can't explain it quickly, it's wrong** — Good code is explainable in one sentence
6. **Small commits or you're hiding something** — Large commits hide mistakes and make reviews impossible

---

## Declarative Naming (MANDATORY)

Functions describe the **result**, not the process. Avoid imperative verbs.

```typescript
// ❌ BAD: Imperative (describes HOW)
transformDocumentTypeToNumber(type: string): number
convertApiResponseToDomain(response: APIResponse): Profile
formatDateForApi(date: Date): string
buildPayloadForRequest(input: Input): Payload

// ✅ GOOD: Declarative (describes WHAT)
apiCompatibleDocumentType(type: string): number
domainProfile(response: APIResponse): Profile
apiFormattedDate(date: Date): string
requestPayload(input: Input): Payload
```

**Booleans** — always start with: `is`, `has`, `can`, `should`, `will`

```typescript
// ✅ GOOD
(isLoading, hasError, canDelete, shouldRetry, willExpire);
```

**Classes** — simple nouns, no complex suffixes

```typescript
// ❌ BAD
class ResourceCreator {}
class PaymentProviderService {}

// ✅ GOOD
class ResourceCreate {}
class PaymentProvider {}
```

**Use Cases** — `[Scope][Domain][Action]`

```typescript
// ✅ GOOD
(UserOrderCreate, UserOrderUpdate, UserOrderDelete);
```

---

## Guard Clauses (MANDATORY — max 2 nesting levels)

```typescript
// ❌ BAD: Nested conditionals
private processData(data: unknown): ProcessedData {
  if (isValid(data)) {
    if (hasRequiredFields(data)) {
      if (meetsBusinessRules(data)) {
        return transform(data);
      }
    }
  }
  throw new ValidationError('Data processing failed');
}

// ✅ GOOD: Early returns
private processData(data: unknown): ProcessedData {
  if (!isValid(data)) throw new ValidationError('Invalid data');
  if (!hasRequiredFields(data)) throw new ValidationError('Missing fields');
  if (!meetsBusinessRules(data)) throw new ValidationError('Business rules failed');
  return transform(data);
}
```

---

## RO-RO Pattern (Receive Object, Return Object)

Use objects for multiple parameters and complex return values.

```typescript
// ❌ BAD: Positional parameters
private process(id: string, amount: number, currency: string, retry: boolean): Result

// ✅ GOOD: Named object inputs and outputs
interface ProcessDataInput {
  readonly data: unknown;
  readonly options?: ProcessOptions;
}

interface ProcessDataOutput {
  readonly result: ProcessedData;
  readonly warnings: string[];
}

private processData({ data, options = {} }: ProcessDataInput): ProcessDataOutput
```

---

## Single Responsibility

Each function has **one clear purpose**, under **20 instructions**.

```typescript
// ❌ BAD: Validation + HTTP + Transformation all in one
private processCustomerData(data: unknown): CustomerProfile { ... }

// ✅ GOOD: One responsibility per function
private processCustomerData(data: unknown): CustomerProfile {
  const validatedData = this.validatedCustomerData(data);
  const response = await this.fetchExternalProfile(validatedData.id);
  return this.domainCustomerProfile(response);
}
```

---

## Class Size Rules

- Less than **200 instructions**
- Less than **10 public methods**
- Less than **10 properties**
- Prefer **composition over inheritance**
- Declare **interfaces** to define contracts

---

## Cyclomatic Complexity

Target ≤ 10 per function. Refactor immediately above 11.

| Score | Action                   |
| ----- | ------------------------ |
| 1–4   | Simple, good             |
| 5–7   | Acceptable with tests    |
| 8–10  | Consider refactoring     |
| 11+   | **Refactor immediately** |

Reduction techniques: extract methods, guard clauses, `ts-pattern` for complex conditionals.

---

## TypeScript 6 — Breaking Changes & Migration Guide

> This project uses **TypeScript 6 (beta)**. These changes are MANDATORY and affect tsconfig, imports, and compiler behavior.

### Defaults Changed (no longer need to set these)

| Setting           | Old default | TS6 default  | Action                                              |
| ----------------- | ----------- | ------------ | --------------------------------------------------- |
| `strict`          | `false`     | **`true`**   | Remove explicit `strict: true` (it's on by default) |
| `module`          | `commonjs`  | **`esnext`** | Remove or set explicitly if you need CJS            |
| `target`          | `es3`       | **`es2025`** | Remove or set explicitly                            |
| `esModuleInterop` | `false`     | **`true`**   | Remove explicit setting — always enabled            |

### Breaking Changes (MUST fix)

```jsonc
// ❌ REMOVED — will not compile
{
  "compilerOptions": {
    "moduleResolution": "classic", // REMOVED
    "moduleResolution": "node", // DEPRECATED (use "nodenext" or "bundler")
    "module": "amd", // REMOVED
    "module": "umd", // REMOVED
    "module": "system", // REMOVED
    "outFile": "./dist/bundle.js", // REMOVED — use a bundler (Vite, esbuild, Rollup)
    "target": "es5", // DEPRECATED — minimum is ES2015
    "baseUrl": ".", // DEPRECATED — use paths with explicit prefixes
    "esModuleInterop": false, // DEPRECATED — always true now
  },
}
```

```jsonc
// ❌ TS6 gotcha: types defaults to []
// Without explicit "types", @types/* packages are NOT included automatically
{
  "compilerOptions": {
    // This will fail silently — process, Buffer, etc. won't be typed
  }
}

// ✅ MUST be explicit
{
  "compilerOptions": {
    "types": ["node", "jest"]    // or ["node"] for backend-only
  }
}
```

```jsonc
// ❌ TS6 gotcha: rootDir defaults to "." (tsconfig.json location)
// If your source is in src/, TS6 will include everything in root by default
{
  "compilerOptions": {
    // Missing rootDir — will compile test files, configs, etc.
  }
}

// ✅ MUST be explicit
{
  "compilerOptions": {
    "rootDir": "./src"
  }
}
```

### Canonical tsconfig Templates

**Backend (NestJS service — `apps/[service]/tsconfig.json`)**

```jsonc
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "target": "es2022",
    "rootDir": "./src",
    "outDir": "./dist",
    "types": ["node"],
    "paths": {
      "@saas/*": ["../../libs/*"],
    },
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts"],
}
```

**Frontend React (Vite — `apps/admin/tsconfig.json`)**

```jsonc
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler",
    "target": "es2022",
    "rootDir": "./src",
    "lib": ["es2022", "dom"],
    "types": [],
    "jsx": "react-jsx",
    "paths": {
      "@saas/*": ["../../libs/*"],
    },
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"],
}
```

**Shared lib (`libs/shared/types/tsconfig.json`)**

```jsonc
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler",
    "target": "es2022",
    "rootDir": "./src",
    "declarationDir": "./dist/types",
    "declaration": true,
    "types": [],
    "paths": {},
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts"],
}
```

**Root `tsconfig.base.json` (NX workspace root)**

```jsonc
{
  "compilerOptions": {
    "target": "es2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "lib": ["es2022"],
    "types": [],
    "declaration": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "paths": {
      "@saas/shared-types": ["libs/shared/types/src/index.ts"],
      "@saas/auth-utils": ["libs/auth/utils/src/index.ts"],
    },
  },
}
```

### New Features in TS6 to Use

```typescript
// Temporal API — built-in date/time handling (replaces date-fns for many cases)
const now = Temporal.Now.plainDateISO();
const booking = Temporal.PlainDateTime.from('2026-03-27T10:00:00');

// Map.getOrInsert() — cleaner cache patterns
const cache = new Map<string, User[]>();
const users = cache.getOrInsert(tenantId, []);

// RegExp.escape() — safe dynamic regex
const safeSearch = new RegExp(RegExp.escape(userInput), 'gi');

// Using declarations (TS5.2+, stable in TS6)
{
  using db = await getDbConnection();
  // db.dispose() called automatically when block exits
}
```

### Migration Checklist

Before running `tsc` with TS6:

- [ ] Replace `moduleResolution: "node"` → `"nodenext"` (backend) or `"bundler"` (frontend)
- [ ] Add `"types": ["node"]` to all backend tsconfigs
- [ ] Add `"rootDir": "./src"` to all tsconfigs
- [ ] Remove `outFile` — configure bundler instead
- [ ] Replace `baseUrl` with explicit `paths` entries
- [ ] Remove `target: "es5"` — use `"es2022"` minimum
- [ ] Remove explicit `esModuleInterop: true` (it's the default now)
