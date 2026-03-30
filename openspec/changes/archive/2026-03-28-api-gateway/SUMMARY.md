# Archive Summary: api-gateway

**Archived**: 2026-03-28  
**Status**: ✅ Complete — 22/22 tasks, all tests passing, lint clean

---

## What Was Implemented

Transformed the placeholder Express-based NestJS API Gateway into a robust Fastify-based BFF (Backend-for-Frontend) that securely proxies requests to downstream microservices.

### Key Deliverables

1. **`libs/shared/http-proxy/`** — New reusable NX library with:
   - `HttpProxyService` — single class wrapping `@fastify/reply-from` with `neverthrow` `Result<ProxySuccess, ProxyError>` error handling
   - Types: `RouteTransform`, `ProxyConfig`, `ProxyContext`, `ProxyResult`, `ProxySuccess`, `ProxyError`
   - 10 unit tests covering: `validatedConfig`, `builtTargetUrl`/`transformedRoute`, successful forwarding, network failures, and unregistered plugin detection

2. **`apps/api-gateway/` — Full Fastify BFF**:
   - `main.ts` — Fastify bootstrap with `@fastify/reply-from` registered BEFORE `NestFactory.create` (critical ordering)
   - `GET /health` — Kubernetes liveness probe returning `{ status, timestamp, version }` (excluded from global prefix)
   - `proxy-auth/` — Full proxy module: `POST register`, `POST login`, `POST refresh` (public) + `POST logout` (guarded with `JwtAuthGuard`)
   - Skeleton modules: `proxy-club/`, `proxy-booking/`, `proxy-inventory/`, `proxy-finance/`

---

## Key Files Created / Modified

### New Files — `libs/shared/http-proxy/`

| File                                                    | Description                                     |
| ------------------------------------------------------- | ----------------------------------------------- |
| `libs/shared/http-proxy/src/index.ts`                   | Barrel export                                   |
| `libs/shared/http-proxy/src/http-proxy.service.ts`      | Core proxy engine (`reply.from()` + neverthrow) |
| `libs/shared/http-proxy/src/http-proxy.service.spec.ts` | 10 unit tests                                   |
| `libs/shared/http-proxy/src/http-proxy.module.ts`       | NestJS module                                   |
| `libs/shared/http-proxy/src/types/transform.types.ts`   | `RouteTransform`, `ProxyConfig`                 |
| `libs/shared/http-proxy/src/types/config.types.ts`      | `ProxyContext`                                  |
| `libs/shared/http-proxy/src/types/proxy.types.ts`       | `ProxyResult`, `ProxySuccess`, `ProxyError`     |
| `libs/shared/http-proxy/project.json`                   | NX lib config (tags: `scope:shared, type:util`) |

### New Files — `apps/api-gateway/src/`

| File                                                                       | Description                       |
| -------------------------------------------------------------------------- | --------------------------------- |
| `apps/api-gateway/src/app/health/health.controller.ts`                     | `GET /health` liveness probe      |
| `apps/api-gateway/src/app/health/health.module.ts`                         | HealthModule                      |
| `apps/api-gateway/src/app/proxy-auth/proxy.constants.ts`                   | `AUTH_SERVICE_URL`, `AUTH_PREFIX` |
| `apps/api-gateway/src/app/proxy-auth/proxy-auth.module.ts`                 | Auth proxy NestJS module          |
| `apps/api-gateway/src/app/proxy-auth/controllers/auth-proxy.controller.ts` | 4 proxy endpoints                 |
| `apps/api-gateway/src/app/proxy-auth/services/auth-proxy.service.ts`       | Auth proxy service                |
| `apps/api-gateway/src/app/proxy-club/`                                     | Skeleton module (3 files)         |
| `apps/api-gateway/src/app/proxy-booking/`                                  | Skeleton module (3 files)         |
| `apps/api-gateway/src/app/proxy-inventory/`                                | Skeleton module (3 files)         |
| `apps/api-gateway/src/app/proxy-finance/`                                  | Skeleton module (3 files)         |

### Modified Files

| File                                     | Change                                                                           |
| ---------------------------------------- | -------------------------------------------------------------------------------- |
| `apps/api-gateway/src/main.ts`           | Express → Fastify bootstrap                                                      |
| `apps/api-gateway/src/app/app.module.ts` | Import all proxy modules + HealthModule                                          |
| `apps/api-gateway/project.json`          | Tags: `scope:customer` → `scope:shared`                                          |
| `tsconfig.base.json`                     | Added `@saas/http-proxy` path mapping                                            |
| `package.json`                           | Added `fastify`, `@nestjs/platform-fastify`, `@fastify/reply-from`, `neverthrow` |

---

## Technical Decisions

| #   | Decision                                  | Choice                      | Rationale                                                                 |
| --- | ----------------------------------------- | --------------------------- | ------------------------------------------------------------------------- |
| 1   | Proxy engine                              | `@fastify/reply-from`       | Streams response directly — no buffering, no double-parse                 |
| 2   | Error handling                            | `neverthrow` `Result<T,E>`  | Compiler-enforced error handling; invisible `try/catch` eliminated        |
| 3   | No `@Body()`/`@Param()` in proxy handlers | Raw `FastifyRequest` only   | Decorators trigger body buffering; proxy must stream raw bytes            |
| 4   | `JwtAuthGuard` placement                  | Per-method on `logout` only | `register`/`login`/`refresh` are unauthenticated by design                |
| 5   | `HttpProxyService` in `libs/`             | `libs/shared/http-proxy`    | Reusable across all future proxy modules (NX boundary safe)               |
| 6   | `@fastify/reply-from` registration order  | BEFORE `NestFactory.create` | NestJS wraps the adapter after this call; reversal causes silent failures |

---

## Route Transform Pattern

```
BFF receives:  POST /api/v1/auth/login
stripPrefix:   /api/v1/auth  →  /login
addPrefix:     /api/v1       →  /api/v1/login
Downstream:    POST http://auth-service:3001/api/v1/login
```

---

## Final Status

| Check                      | Result            |
| -------------------------- | ----------------- |
| Tasks                      | ✅ 22/22 complete |
| Tests: `shared-http-proxy` | ✅ 10/10 passing  |
| Tests: `api-gateway`       | ✅ 1/1 passing    |
| Lint: `api-gateway`        | ✅ 0 errors       |
| Lint: `shared-http-proxy`  | ✅ 0 errors       |
| Design deviations          | ✅ None           |
