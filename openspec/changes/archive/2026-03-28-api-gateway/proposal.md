# Proposal: api-gateway

## Intent

Transform the placeholder Express-based NestJS API Gateway into a robust Fastify-based BFF (Backend-for-Frontend) that securely proxies requests to downstream microservices, starting with the `auth-service`.

## Scope

### In Scope

- Install `fastify`, `@nestjs/platform-fastify`, `@fastify/reply-from`, and `neverthrow`.
- Create a new shared NX library `libs/shared/http-proxy` for the reusable proxy engine.
- Refactor `apps/api-gateway/src/main.ts` to bootstrap Fastify instead of Express.
- Implement `proxy-auth` module routing 4 endpoints (`register`, `login`, `refresh`, `logout`) to `auth-service`.
- Apply `JwtAuthGuard` to the `POST /api/v1/auth/logout` endpoint in the BFF.
- Create skeleton proxy controllers for `club`, `booking`, `inventory`, and `finance`.
- Add a health check endpoint `GET /health`.
- Write unit tests for `HttpProxyService`.
- Update tags in `apps/api-gateway/project.json` from `scope:customer` to `scope:shared`.

### Out of Scope

- Full implementation of `club`, `booking`, `inventory`, and `finance` proxy routes.
- Complex data aggregation, payload mapping, or response transformation.
- End-to-end (E2E) testing for the gateway.

## Approach

Replace Express with Fastify to leverage its high-performance proxying capabilities via `@fastify/reply-from`. Encapsulate the proxying logic in a robust `HttpProxyService` (inside `libs/shared/http-proxy`) using `neverthrow` for safe error handling. Ensure `@fastify/reply-from` is registered **before** `NestFactory.create` to avoid silent failures. Use NestJS controllers strictly as route definers that delegate to the proxy service.

## Affected Areas

| Area                                   | Impact   | Description                                               |
| -------------------------------------- | -------- | --------------------------------------------------------- |
| `apps/api-gateway/src/main.ts`         | Modified | Switch to Fastify bootstrap and register reply-from early |
| `apps/api-gateway/project.json`        | Modified | Change tags to `scope:shared`                             |
| `libs/shared/http-proxy/`              | New      | Reusable proxy service and types                          |
| `apps/api-gateway/src/app/proxy-auth/` | New      | Auth proxy controller and module                          |
| `apps/api-gateway/src/app/proxy-*/`    | New      | Skeleton controllers for other domains                    |

## Risks

| Risk                                 | Likelihood | Mitigation                                                         |
| ------------------------------------ | ---------- | ------------------------------------------------------------------ |
| `@fastify/reply-from` silent failure | High       | Enforce strict registration order before `NestFactory.create`      |
| NX Boundary Violations               | Medium     | Verify `tsconfig.base.json` paths and tags                         |
| Unprotected routes                   | Low        | Apply `JwtAuthGuard` explicitly on sensitive routes like `/logout` |

## Rollback Plan

- Revert the Fastify bootstrap changes in `main.ts`.
- Remove Fastify-related packages from `package.json`.
- Delete `libs/shared/http-proxy` and revert `project.json` tags.

## Dependencies

- `@saas/shared-types`
- `@saas/auth-utils` (for `JwtAuthGuard`)

## Success Criteria

- [ ] API Gateway boots successfully using Fastify.
- [ ] `GET /health` returns 200 OK.
- [ ] `POST /api/v1/auth/login`, `register`, and `refresh` proxy successfully without guards.
- [ ] `POST /api/v1/auth/logout` successfully proxies with `JwtAuthGuard`.
- [ ] `HttpProxyService` unit tests pass.
