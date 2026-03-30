# Exploration: auth-service

## Current State

`apps/auth-service` es un NestJS placeholder generado por NX. Contiene:

- `src/main.ts` — bootstrap básico, sin JWT, sin prefijo de versión
- `src/app/app.module.ts` — módulo vacío, sin imports
- `webpack.config.js` — compilación con SWC (correcto para TS6)
- `tsconfig.app.json` — usa `module: "node16"` y `moduleResolution: "node16"` (mismo patrón que auth-service, necesita revisión pero SWC lo transpila correctamente en runtime)

**Dependencias instaladas en el workspace root:**

- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` — básicas ✅
- **NO** instalados: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-local`, `passport-jwt`, `bcrypt`, `@prisma/client`, `prisma`

**Librerías disponibles:**

- `@saas/shared-types` — schemas de `UserSchema`, `USER_ROLE`, `TenantedEntitySchema`, `DomainError` ya implementados ✅
- `@saas/auth-utils` (`libs/auth/utils/`) — placeholder vacío, destinado a JWT helpers

**Base de datos:** PostgreSQL 16 via Docker Compose. Prisma es el ORM elegido pero aún no instalado.

---

## Affected Areas

- `apps/auth-service/src/` — toda la implementación del servicio
- `apps/auth-service/src/app/app.module.ts` — reemplazar por `AuthModule` root
- `libs/auth/utils/src/` — implementar helpers JWT (sign, verify, decode)
- `package.json` (workspace root) — agregar deps: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`, `prisma`, `@prisma/client`
- `apps/auth-service/prisma/schema.prisma` — esquema de la base de datos para auth

---

## Scope: ¿Qué implementar en este change?

El auth-service es un microservicio completo. Para mantener las tasks completables en una sesión, el scope propuesto es:

### Opción A — Scope completo (1 change grande)

Implementar TODO el auth-service: Prisma schema, User entity, repositorio, register/login/refresh/logout endpoints, JWT access+refresh tokens, guards, `libs/auth-utils`.

- **Pros**: El servicio queda funcional end-to-end en un solo ciclo SDD
- **Cons**: ~50-60 tasks, riesgo de ser demasiado grande para una sesión, mezcla de capas (infra + dominio + HTTP)
- **Esfuerzo**: Alto

### Opción B — Scope por capas (2-3 changes separados)

1. `auth-service-infra`: Prisma schema + migraciones + repository pattern
2. `auth-service-core`: Use cases (register/login/refresh/logout) + JWT + guards
3. `auth-service-http`: Controllers, DTOs, Swagger (opcional)

- **Pros**: Cada change es manejable, fácil de verificar, rollback seguro por capa
- **Cons**: Más overhead de pipeline SDD (3 ciclos)
- **Esfuerzo**: Medio por change

### Opción C — Scope funcional mínimo (recomendado)

Implementar lo suficiente para que el servicio sea funcional: Prisma schema (User + RefreshToken), repository, register + login + refresh + logout, JWT access (15min) + refresh (7d) tokens, `JwtAuthGuard`, y `libs/auth-utils` con los helpers de token. **Sin** Swagger, **sin** rate limiting, **sin** email verification (dejamos para otros changes).

- **Pros**: Un ciclo SDD completo y coherente, ~35-40 tasks, funcional de punta a punta
- **Cons**: Requiere instalar Prisma + passport en el mismo change
- **Esfuerzo**: Medio-Alto

---

## Recommendation

**Opción C** — Scope funcional mínimo. Es el balance correcto entre completitud y manejabilidad. El auth-service sin JWT + Prisma no tiene sentido funcional. Incluye:

1. **Infraestructura**: instalar deps (`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`, `prisma`, `@prisma/client`), configurar Prisma con schema `User` + `RefreshToken`
2. **Dominio**: `User` entity, `AuthToken` value object, `IUserRepository` interface, use cases puros (`RegisterUseCase`, `LoginUseCase`, `RefreshUseCase`, `LogoutUseCase`)
3. **Aplicación**: `UserRepository` (Prisma), `AuthService` orchestrando use cases, `JwtStrategy` (Passport), `JwtAuthGuard`
4. **HTTP**: `AuthController` con 4 rutas (`POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`), DTOs con Zod
5. **Lib**: `libs/auth/utils/` — `signToken()`, `verifyToken()`, `decodeToken()` helpers

---

## Risks

- **Prisma + TS6**: Prisma genera código con patrones que pueden chocar con TS6 strict mode. Mitigación: usar `skipLibCheck: true` (ya está en `tsconfig.base.json`) y `// @ts-ignore` solo en los generated files si es necesario.
- **bcrypt vs bcryptjs**: `bcrypt` requiere binarios nativos, puede fallar en CI. Alternativa: `bcryptjs` (pure JS, más lento pero sin deps nativas). Recomendación: usar `bcryptjs` para evitar problemas de compilación.
- **Refresh token rotation**: Implementar "reuse detection" es complejo. Para este change: refresh simple sin detección de reutilización (se puede agregar en un change posterior).
- **`tsconfig.app.json` usa `node16`**: SWC transpila correctamente en runtime pero los type-checks internos del editor pueden mostrar warnings. No bloquea, se puede actualizar en un change de cleanup posterior.

---

## Ready for Proposal

Sí. El scope está claro: auth-service funcional mínimo con Prisma + JWT + Passport + 4 endpoints + `auth-utils` helpers. Dependencias externas identificadas. Riesgos documentados.
