# Design: API Gateway (BFF)

## Technical Approach

Replace the Express placeholder with a Fastify-based BFF. `@fastify/reply-from` must be registered on the raw Fastify instance **before** `NestFactory.create` — NestJS wraps the adapter after this call, so any registration order reversal causes silent failures. All forwarding logic lives in a single `HttpProxyService` in `libs/shared/http-proxy`. Controllers are thin, two-line delegates with no body/param parsing. `neverthrow` makes error paths explicit and un-swallowable.

---

## Architecture Decisions

| #   | Decision                                      | Choice                                                         | Alternatives                          | Rationale                                                                                                                            |
| --- | --------------------------------------------- | -------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Proxy engine                                  | `@fastify/reply-from`                                          | Manual HTTP client (`axios`/`fetch`)  | `reply.from()` streams the response directly — no buffering, no body re-serialization. Axios would force double-parse.               |
| 2   | Error handling                                | `neverthrow` `Result<T,E>`                                     | `try/catch`, custom exception         | Explicit `isErr()` in every handler: the compiler enforces handling. `try/catch` is invisible until it blows up in prod.             |
| 3   | No `@Body()` / `@Param()` in proxy handlers   | Raw `FastifyRequest` only                                      | NestJS decorators                     | Decorators trigger body buffering; proxy must stream raw bytes. One exception: Swagger-only decorators are allowed as metadata-only. |
| 4   | `JwtAuthGuard` placement for mixed routes     | `@UseGuards` per-method on `logout`; no guard on other methods | Class-level guard                     | `register`/`login`/`refresh` are unauthenticated by design. Class-level guard would block them.                                      |
| 5   | `HttpProxyService` in `libs/` not `apps/`     | `libs/shared/http-proxy`                                       | Inline inside `proxy-auth`            | Reusable across all future proxy modules without cross-app imports (NX boundary).                                                    |
| 6   | Proxy service per domain (`AuthProxyService`) | One service per domain in `apps/api-gateway`                   | Single `ProxyService` for all domains | Each domain service has its own config (URL, prefix). Single service would need complex routing maps that grow unboundedly.          |

---

## Data Flow

```
Client
  │
  │  POST /api/v1/auth/login
  ▼
┌─────────────────────────────────────────────────────┐
│  api-gateway (Fastify + NestJS)                     │
│                                                     │
│  AuthProxyController.login(req, reply)              │
│    │                                                │
│    ▼                                                │
│  AuthProxyService.proxyToAuth(req, reply)           │
│    │  config: { targetUrl, routeTransform }         │
│    ▼                                                │
│  HttpProxyService.forwardRequest(context)           │
│    │  1. validatedConfig(config)                    │
│    │  2. builtTargetUrl(req.url, config)            │
│    │     strip /api/v1/auth → add /api/v1           │
│    │  3. executedProxy(context, targetUrl)          │
│    │     reply.from("http://auth-svc:3001/api/v1/login")
│    └─→ Result<ProxySuccess, ProxyError>             │
│                                                     │
│  handler: if (result.isErr()) handleProxyError()   │
└─────────────────────────────────────────────────────┘
  │
  ▼ (streamed response)
auth-service:3001/api/v1/login

Error paths:
  PROXY_ERROR (network) → 502 Bad Gateway
  TIMEOUT              → 504 Gateway Timeout
  Downstream 4xx/5xx   → forwarded transparently by reply.from()
```

---

## File Changes

### New Files

| File                                                                                 | Action | Description                                      |
| ------------------------------------------------------------------------------------ | ------ | ------------------------------------------------ |
| `libs/shared/http-proxy/src/index.ts`                                                | Create | Barrel export                                    |
| `libs/shared/http-proxy/src/http-proxy.service.ts`                                   | Create | Single class that calls `reply.from()`           |
| `libs/shared/http-proxy/src/types/transform.types.ts`                                | Create | `RouteTransform`, `ProxyConfig`                  |
| `libs/shared/http-proxy/src/types/config.types.ts`                                   | Create | `ProxyContext`                                   |
| `libs/shared/http-proxy/src/types/proxy.types.ts`                                    | Create | `ProxyResult`, `ProxySuccess`, `ProxyError`      |
| `libs/shared/http-proxy/src/http-proxy.module.ts`                                    | Create | NestJS module exporting `HttpProxyService`       |
| `libs/shared/http-proxy/project.json`                                                | Create | NX lib config, tags: `scope:shared, type:util`   |
| `libs/shared/http-proxy/tsconfig.json`                                               | Create | Extends `tsconfig.base.json`                     |
| `libs/shared/http-proxy/tsconfig.lib.json`                                           | Create | Build tsconfig                                   |
| `libs/shared/http-proxy/tsconfig.spec.json`                                          | Create | Test tsconfig                                    |
| `libs/shared/http-proxy/package.json`                                                | Create | Lib package.json                                 |
| `apps/api-gateway/src/app/health/health.controller.ts`                               | Create | `GET /health` → `{ status, timestamp, version }` |
| `apps/api-gateway/src/app/health/health.module.ts`                                   | Create | HealthModule                                     |
| `apps/api-gateway/src/app/proxy-auth/proxy.constants.ts`                             | Create | `AUTH_SERVICE_URL`, `AUTH_PREFIX`                |
| `apps/api-gateway/src/app/proxy-auth/proxy-auth.module.ts`                           | Create | NestJS module                                    |
| `apps/api-gateway/src/app/proxy-auth/controllers/auth-proxy.controller.ts`           | Create | 4 endpoints proxy                                |
| `apps/api-gateway/src/app/proxy-auth/services/auth-proxy.service.ts`                 | Create | Wraps `HttpProxyService`                         |
| `apps/api-gateway/src/app/proxy-club/proxy.constants.ts`                             | Create | Skeleton constants                               |
| `apps/api-gateway/src/app/proxy-club/proxy-club.module.ts`                           | Create | Skeleton module                                  |
| `apps/api-gateway/src/app/proxy-club/controllers/club-proxy.controller.ts`           | Create | Skeleton controller                              |
| `apps/api-gateway/src/app/proxy-booking/proxy.constants.ts`                          | Create | Skeleton constants                               |
| `apps/api-gateway/src/app/proxy-booking/proxy-booking.module.ts`                     | Create | Skeleton module                                  |
| `apps/api-gateway/src/app/proxy-booking/controllers/booking-proxy.controller.ts`     | Create | Skeleton controller                              |
| `apps/api-gateway/src/app/proxy-inventory/proxy.constants.ts`                        | Create | Skeleton constants                               |
| `apps/api-gateway/src/app/proxy-inventory/proxy-inventory.module.ts`                 | Create | Skeleton module                                  |
| `apps/api-gateway/src/app/proxy-inventory/controllers/inventory-proxy.controller.ts` | Create | Skeleton controller                              |
| `apps/api-gateway/src/app/proxy-finance/proxy.constants.ts`                          | Create | Skeleton constants                               |
| `apps/api-gateway/src/app/proxy-finance/proxy-finance.module.ts`                     | Create | Skeleton module                                  |
| `apps/api-gateway/src/app/proxy-finance/controllers/finance-proxy.controller.ts`     | Create | Skeleton controller                              |
| `libs/shared/http-proxy/src/http-proxy.service.spec.ts`                              | Create | Unit tests for `HttpProxyService`                |

### Modified Files

| File                                     | Action | Description                                                                                        |
| ---------------------------------------- | ------ | -------------------------------------------------------------------------------------------------- |
| `apps/api-gateway/src/main.ts`           | Modify | Replace Express bootstrap with Fastify; register `@fastify/reply-from` before `NestFactory.create` |
| `apps/api-gateway/src/app/app.module.ts` | Modify | Import all proxy modules + HealthModule                                                            |
| `apps/api-gateway/project.json`          | Modify | Change `scope:customer` → `scope:shared` in tags                                                   |
| `tsconfig.base.json`                     | Modify | Add `@saas/http-proxy` path mapping                                                                |

---

## Interfaces / Contracts

### `libs/shared/http-proxy/src/types/transform.types.ts`

```typescript
export type RouteTransform = {
  readonly stripPrefix?: string;
  readonly addPrefix?: string;
};

export type ProxyConfig = {
  readonly targetUrl: string;
  readonly routeTransform?: RouteTransform;
};
```

### `libs/shared/http-proxy/src/types/config.types.ts`

```typescript
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ProxyConfig } from './transform.types';

export type ProxyContext = {
  readonly request: FastifyRequest;
  readonly reply: FastifyReply;
  readonly config: ProxyConfig;
  readonly startTime: number;
};
```

### `libs/shared/http-proxy/src/types/proxy.types.ts`

```typescript
import type { Result } from 'neverthrow';

export type ProxyError = {
  readonly code: string;
  readonly message: string;
  readonly originalPath?: string;
  readonly targetUrl?: string;
  readonly cause?: unknown;
};

export type ProxySuccess = {
  readonly statusCode: number;
  readonly headers: Record<string, string>;
  readonly targetUrl: string;
  readonly duration: number;
};

export type ProxyResult = Result<ProxySuccess, ProxyError>;
```

### `HttpProxyService` public contract

```typescript
@Injectable()
export class HttpProxyService {
  async forwardRequest(context: ProxyContext): Promise<ProxyResult>;
  private validatedConfig(config: ProxyConfig): Result<void, ProxyError>;
  private builtTargetUrl(
    path: string,
    config: ProxyConfig,
  ): Result<string, ProxyError>;
  private transformedRoute(path: string, transform: RouteTransform): string;
  private async executedProxy(
    context: ProxyContext,
    targetUrl: string,
  ): Promise<ProxyResult>;
}
```

### Route Transform Table

| BFF incoming                 | `stripPrefix`  | `addPrefix` | Forwarded to                         |
| ---------------------------- | -------------- | ----------- | ------------------------------------ |
| `POST /api/v1/auth/register` | `/api/v1/auth` | `/api/v1`   | `{AUTH_SERVICE_URL}/api/v1/register` |
| `POST /api/v1/auth/login`    | `/api/v1/auth` | `/api/v1`   | `{AUTH_SERVICE_URL}/api/v1/login`    |
| `POST /api/v1/auth/refresh`  | `/api/v1/auth` | `/api/v1`   | `{AUTH_SERVICE_URL}/api/v1/refresh`  |
| `POST /api/v1/auth/logout`   | `/api/v1/auth` | `/api/v1`   | `{AUTH_SERVICE_URL}/api/v1/logout`   |

### `main.ts` bootstrap order (CRITICAL)

```typescript
// Step 1: Create raw FastifyAdapter
const adapter = new FastifyAdapter({ bodyLimit: 10_485_760 }); // 10 MB

// Step 2: Register @fastify/reply-from on raw instance BEFORE NestFactory.create
await adapter.getInstance().register(import('@fastify/reply-from'), {
  http: { requestOptions: { timeout: 30_000 } },
});

// Step 3: Create NestJS app with the pre-configured adapter
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  adapter,
);

// Step 4: Configure app
app.setGlobalPrefix('api/v1', { exclude: ['health'] });
app.enableCors({ origin: process.env['CORS_ORIGIN'] ?? '*' });

// Step 5: Listen
await app.listen(process.env['PORT'] ?? 3000, '0.0.0.0');
```

> **Why `exclude: ['health']`?** The `GET /health` route must be accessible without the `api/v1` prefix for Kubernetes liveness probes.

### `proxy.constants.ts` pattern (auth)

```typescript
export const AUTH_SERVICE_URL =
  process.env['AUTH_SERVICE_URL'] ?? 'http://localhost:3001';
export const AUTH_PREFIX = '/api/v1/auth';
```

### `AuthProxyController` — mixed guard approach

```typescript
// No class-level guard: register/login/refresh are public
@Controller('auth')
export class AuthProxyController {
  // register, login, refresh — no @UseGuards

  @Post('logout')
  @UseGuards(JwtAuthGuard) // ← guard only on this method
  async logout(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    const result = await this.proxyService.proxyToAuth(req, reply);
    if (result.isErr()) this.handleProxyError(result.error, reply);
  }
}
```

### Health endpoint

```typescript
// GET /health (excluded from globalPrefix)
@Get()
health(): HealthResponse {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env['npm_package_version'] ?? '0.0.0',
  };
}
```

### `tsconfig.base.json` addition

```json
"@saas/http-proxy": ["libs/shared/http-proxy/src/index.ts"]
```

### `libs/shared/http-proxy/project.json`

```json
{
  "name": "shared-http-proxy",
  "$schema": "../../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/shared/http-proxy/src",
  "projectType": "library",
  "tags": ["scope:shared", "type:util"],
  "targets": {
    "build": {
      "executor": "@nx/js:tsc",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/libs/shared/http-proxy",
        "main": "libs/shared/http-proxy/src/index.ts",
        "tsConfig": "libs/shared/http-proxy/tsconfig.lib.json",
        "assets": ["libs/shared/http-proxy/*.md"]
      }
    }
  }
}
```

---

## Testing Strategy

| Layer                                        | What to Test                                                                                                        | Approach                                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Unit — `HttpProxyService.forwardRequest`     | Success: `reply.from()` called with correct transformed URL, returns `ok(ProxySuccess)`                             | Mock `FastifyRequest` (url, method), `FastifyReply` (statusCode, getHeaders, `from` spy), assert `ok()` returned |
| Unit — `builtTargetUrl` / `transformedRoute` | Strip + add prefix correct; trailing slash handling; empty strip/add; invalid URL                                   | Pure function: call with known strings, assert result string                                                     |
| Unit — `validatedConfig`                     | Missing `targetUrl` → `err(INVALID_CONFIG)`; invalid URL → `err(INVALID_CONFIG)`                                    | Call with bad config, assert `isErr()` and error code                                                            |
| Unit — network failure                       | `reply.from` throws → returns `err(PROXY_ERROR)` with `cause`                                                       | Mock `from` to `throw new Error('ECONNREFUSED')`, assert `err`                                                   |
| Unit — `@fastify/reply-from` not registered  | `reply.from` is not a function → `err(PROXY_ERROR)` with code `PROXY_ERROR` and message containing `not registered` | Mock `reply` without `from`, assert `err`                                                                        |
| Module — `ProxyAuthModule`                   | Module compiles, `AuthProxyController` registered                                                                   | `Test.createTestingModule`, `moduleRef.get(AuthProxyController)` not null                                        |

**What NOT to test:**

- E2E: explicitly out of scope per proposal
- Skeleton controllers for club/booking/inventory/finance: no logic to test

---

## Dependencies to Install

```bash
# Runtime
pnpm add fastify @nestjs/platform-fastify @fastify/reply-from neverthrow

# Dev
pnpm add -D @types/node
```

| Package                    | Version target | Why                                     |
| -------------------------- | -------------- | --------------------------------------- |
| `fastify`                  | `^5.x`         | Peer dep for `@nestjs/platform-fastify` |
| `@nestjs/platform-fastify` | latest         | NestJS Fastify adapter                  |
| `@fastify/reply-from`      | `^10.x`        | HTTP proxy plugin                       |
| `neverthrow`               | `^8.x`         | `Result<T,E>` type-safe error handling  |

> Note: `@nestjs/platform-express` remains in package.json but is unused — do not remove it yet to avoid breaking other apps that may depend on it.

---

## Configuration Changes

### `tsconfig.base.json` — add path mapping

```json
// In "paths":
"@saas/http-proxy": ["libs/shared/http-proxy/src/index.ts"]
```

### `apps/api-gateway/project.json` — update tags

```json
// Before:
"tags": ["scope:customer", "type:bff", "platform:node"]

// After:
"tags": ["scope:shared", "type:bff", "platform:node"]
```

---

## Full File Tree

```
libs/shared/http-proxy/
├── package.json
├── project.json                          ← scope:shared, type:util
├── tsconfig.json
├── tsconfig.lib.json
├── tsconfig.spec.json
└── src/
    ├── index.ts                          ← barrel: HttpProxyService, HttpProxyModule, all types
    ├── http-proxy.module.ts
    ├── http-proxy.service.ts
    ├── http-proxy.service.spec.ts        ← unit tests
    └── types/
        ├── transform.types.ts            ← RouteTransform, ProxyConfig
        ├── config.types.ts               ← ProxyContext
        └── proxy.types.ts                ← ProxyResult, ProxySuccess, ProxyError

apps/api-gateway/src/
├── main.ts                               ← MODIFIED: Fastify bootstrap
└── app/
    ├── app.module.ts                     ← MODIFIED: imports all proxy modules
    ├── health/
    │   ├── health.controller.ts
    │   └── health.module.ts
    ├── proxy-auth/
    │   ├── proxy.constants.ts            ← AUTH_SERVICE_URL, AUTH_PREFIX
    │   ├── proxy-auth.module.ts
    │   ├── controllers/
    │   │   └── auth-proxy.controller.ts  ← register, login, refresh, logout
    │   └── services/
    │       └── auth-proxy.service.ts
    ├── proxy-club/
    │   ├── proxy.constants.ts
    │   ├── proxy-club.module.ts
    │   └── controllers/
    │       └── club-proxy.controller.ts  ← TODO: implement when service is ready
    ├── proxy-booking/
    │   ├── proxy.constants.ts
    │   ├── proxy-booking.module.ts
    │   └── controllers/
    │       └── booking-proxy.controller.ts  ← TODO: implement when service is ready
    ├── proxy-inventory/
    │   ├── proxy.constants.ts
    │   ├── proxy-inventory.module.ts
    │   └── controllers/
    │       └── inventory-proxy.controller.ts  ← TODO: implement when service is ready
    └── proxy-finance/
        ├── proxy.constants.ts
        ├── proxy-finance.module.ts
        └── controllers/
            └── finance-proxy.controller.ts  ← TODO: implement when service is ready
```

---

## Open Questions

- None — design is complete and unambiguous.
