# Proposal: auth-service

## Intent

Implementar el microservicio de autenticación funcional para la plataforma SaaS multi-tenant. Sin auth, ningún otro servicio puede arrancar. El auth-service es el punto de entrada de todos los usuarios (admin y customer) y el emisor de los JWT que validan las peticiones en el API Gateway.

## Scope

### In Scope

- Instalación de dependencias: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcryptjs`, `prisma`, `@prisma/client`
- Prisma schema: modelos `User` y `RefreshToken` con multi-tenancy (`tenantId`)
- Dominio puro: `User` entity, `IUserRepository` interface, use cases (`RegisterUseCase`, `LoginUseCase`, `RefreshUseCase`, `LogoutUseCase`)
- Infraestructura: `PrismaUserRepository`, `PrismaService`, `AuthService` orchestrando use cases
- Auth flow: JWT access token (15min) + refresh token (7 días) rotativo
- HTTP layer: `AuthController` con `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- Guards: `JwtAuthGuard` (Passport strategy) para proteger rutas
- DTOs: validados con Zod (`RegisterDto`, `LoginDto`, `RefreshDto`)
- `libs/auth/utils/` — helpers: `signAccessToken()`, `signRefreshToken()`, `verifyToken()`, `decodeToken()`
- Tests unitarios para use cases y schemas (Jest)

### Out of Scope

- Email verification / confirmación de cuenta
- Rate limiting / throttling
- Recuperación de contraseña
- OAuth / social login
- Swagger / OpenAPI docs
- Refresh token reuse detection (se agrega en un change posterior)
- RBAC guards (van en el API Gateway)

## Approach

Arquitectura en capas siguiendo Hexagonal/Clean: dominio puro sin frameworks → use cases orquestando el dominio → repositorio Prisma como adaptador → NestJS como delivery mechanism. Los schemas Zod de `@saas/shared-types` son la fuente de verdad de las entidades. Los DTOs extienden esos schemas para las validaciones HTTP.

## Affected Areas

| Area                        | Impact   | Description                                                                 |
| --------------------------- | -------- | --------------------------------------------------------------------------- |
| `apps/auth-service/src/`    | Modified | Reemplazar placeholder con módulos de dominio, aplicación e infraestructura |
| `apps/auth-service/prisma/` | New      | Schema Prisma con User + RefreshToken                                       |
| `libs/auth/utils/src/`      | Modified | Implementar helpers JWT (placeholder → real)                                |
| `package.json` (root)       | Modified | Agregar deps de auth + Prisma                                               |

## Risks

| Risk                                | Likelihood | Mitigation                                                                  |
| ----------------------------------- | ---------- | --------------------------------------------------------------------------- |
| Prisma + TS6 strict mode conflictos | Med        | `skipLibCheck: true` ya configurado; types de Prisma client son compatibles |
| `bcrypt` binarios nativos en CI     | Med        | Usar `bcryptjs` (pure JS, sin binarios nativos)                             |
| `tsconfig.app.json` con `node16`    | Low        | SWC transpila correctamente; no bloquea runtime ni tests                    |

## Rollback Plan

Todos los cambios son aditivos: nuevos archivos en `apps/auth-service/src/` y `libs/auth/utils/src/`. Para revertir: `git revert` del commit del change. La migración Prisma es la única operación con estado — se puede revertir con `prisma migrate reset` en desarrollo local.

## Dependencies

- `@saas/shared-types` — ya implementado (UserSchema, DomainError) ✅
- PostgreSQL 16 vía Docker Compose — ya configurado ✅
- NestJS core (`@nestjs/common`, `@nestjs/core`) — ya instalado ✅

## Success Criteria

- [ ] `pnpm nx test auth-service` — todos los tests de use cases pasan
- [ ] `pnpm nx lint auth-service` — 0 errores
- [ ] `POST /auth/register` crea un user y devuelve access + refresh tokens
- [ ] `POST /auth/login` valida credenciales y devuelve tokens
- [ ] `POST /auth/refresh` rota el refresh token
- [ ] `POST /auth/logout` invalida el refresh token en DB
- [ ] `JwtAuthGuard` rechaza requests sin Bearer token válido
