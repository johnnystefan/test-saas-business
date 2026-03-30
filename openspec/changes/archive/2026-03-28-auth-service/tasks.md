# Tasks: auth-service

## Phase 1: Infrastructure & Dependencies

- [ ] 1.1 Install workspace deps: `pnpm add -w @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs jsonwebtoken @prisma/client`
- [ ] 1.2 Install dev deps: `pnpm add -D -w prisma @types/passport-jwt @types/bcryptjs @types/jsonwebtoken`
- [ ] 1.3 Create `apps/auth-service/prisma/schema.prisma` — `User` model (id uuid, email, passwordHash, name, role, status, tenantId, timestamps) + `RefreshToken` model (id, token, userId, revokedAt, expiresAt)
- [ ] 1.4 Run `pnpm exec prisma generate --schema=apps/auth-service/prisma/schema.prisma` to generate Prisma client
- [ ] 1.5 Update `libs/auth/utils/tsconfig.json`: `module: "esnext"`, `moduleResolution: "bundler"` (same fix as shared-types)
- [ ] 1.6 Add `jsonwebtoken` as `peerDependency` in `libs/auth/utils/package.json`

## Phase 2: Domain Layer (Pure — no framework)

- [ ] 2.1 Create `apps/auth-service/src/domain/user/user.entity.ts` — `User` class with `id`, `email`, `passwordHash`, `name`, `role`, `status`, `tenantId`, `createdAt`, `updatedAt`
- [ ] 2.2 Create `apps/auth-service/src/domain/user/i-user.repository.ts` — `IUserRepository` interface: `findByEmail`, `findById`, `create`, `saveRefreshToken`, `findRefreshToken`, `revokeRefreshToken`
- [ ] 2.3 Create `apps/auth-service/src/domain/use-cases/register.use-case.ts` — validates no duplicate email, hashes password with `bcryptjs`, calls `repository.create()`, returns tokens
- [ ] 2.4 Create `apps/auth-service/src/domain/use-cases/login.use-case.ts` — `findByEmail`, `bcryptjs.compare()`, returns tokens or throws `InvalidArgumentError`
- [ ] 2.5 Create `apps/auth-service/src/domain/use-cases/refresh.use-case.ts` — validates refresh token in DB, rotates (revoke old, save new), returns new tokens
- [ ] 2.6 Create `apps/auth-service/src/domain/use-cases/logout.use-case.ts` — calls `repository.revokeRefreshToken()`

## Phase 3: Auth Utils Library

- [ ] 3.1 Rewrite `libs/auth/utils/src/lib/auth-utils.ts` — `signAccessToken(payload, secret, expiresIn)`, `signRefreshToken(payload, secret)`, `verifyToken(token, secret)`, `decodeToken(token)` using `jsonwebtoken`
- [ ] 3.2 Update `libs/auth/utils/src/index.ts` — re-export everything from `auth-utils.ts`

## Phase 4: Infrastructure Layer (Prisma + NestJS adapters)

- [ ] 4.1 Create `apps/auth-service/src/infrastructure/prisma/prisma.service.ts` — `PrismaService extends PrismaClient` with `onModuleInit` + `onModuleDestroy`
- [ ] 4.2 Create `apps/auth-service/src/infrastructure/prisma/prisma-user.repository.ts` — `PrismaUserRepository implements IUserRepository` using `PrismaService`

## Phase 5: HTTP & NestJS Layer

- [ ] 5.1 Create `apps/auth-service/src/auth/dto/register.dto.ts` — Zod schema + `RegisterDto` type
- [ ] 5.2 Create `apps/auth-service/src/auth/dto/login.dto.ts` — Zod schema + `LoginDto` type
- [ ] 5.3 Create `apps/auth-service/src/auth/dto/refresh.dto.ts` — Zod schema + `RefreshDto` type
- [ ] 5.4 Create `apps/auth-service/src/auth/strategies/jwt.strategy.ts` — `JwtStrategy extends PassportStrategy` reading `JWT_SECRET` from env
- [ ] 5.5 Create `apps/auth-service/src/auth/guards/jwt-auth.guard.ts` — `JwtAuthGuard extends AuthGuard('jwt')`
- [ ] 5.6 Create `apps/auth-service/src/auth/auth.service.ts` — wraps use cases, injects `IUserRepository` via DI token
- [ ] 5.7 Create `apps/auth-service/src/auth/auth.controller.ts` — `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`; delegates only
- [ ] 5.8 Create `apps/auth-service/src/auth/auth.module.ts` — imports `JwtModule`, `PassportModule`, providers for use cases + repository + service
- [ ] 5.9 Update `apps/auth-service/src/app/app.module.ts` — import `AuthModule`
- [ ] 5.10 Update `apps/auth-service/src/main.ts` — add `app.useGlobalPipes(new ZodValidationPipe())`

## Phase 6: Tests

- [ ] 6.1 Create `apps/auth-service/src/domain/use-cases/register.use-case.spec.ts` — mock `IUserRepository`, test: happy path returns tokens, duplicate email throws conflict
- [ ] 6.2 Create `apps/auth-service/src/domain/use-cases/login.use-case.spec.ts` — test: valid credentials return tokens, wrong password throws, unknown email throws
- [ ] 6.3 Create `apps/auth-service/src/domain/use-cases/refresh.use-case.spec.ts` — test: valid token rotates successfully, revoked token throws
- [ ] 6.4 Create `apps/auth-service/src/domain/use-cases/logout.use-case.spec.ts` — test: revokes token, subsequent refresh fails
- [ ] 6.5 Rewrite `libs/auth/utils/src/lib/auth-utils.spec.ts` — sign+verify round-trip, expired token throws, decode without verify

## Phase 7: Quality Gate

- [ ] 7.1 Run `pnpm nx lint auth-service` — zero errors
- [ ] 7.2 Run `pnpm nx test auth-service` — all use case tests pass
- [ ] 7.3 Run `pnpm nx lint auth-utils` — zero errors
- [ ] 7.4 Run `pnpm nx test auth-utils` — all helper tests pass
