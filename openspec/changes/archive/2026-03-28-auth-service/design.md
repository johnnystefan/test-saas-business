# Design: auth-service

## Technical Approach

Implementar el auth-service siguiendo arquitectura hexagonal en 4 capas: dominio puro → use cases → infraestructura (Prisma) → HTTP (NestJS). `@saas/shared-types` provee los schemas base. `@saas/auth-utils` expone los helpers JWT sin dependencias de framework. NestJS actúa únicamente como delivery mechanism.

---

## Architecture Decisions

| #   | Choice                                                          | Alternatives                        | Rationale                                                                                                                 |
| --- | --------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | `bcryptjs` (pure JS)                                            | `bcrypt` (native binaries)          | Sin dependencias nativas — funciona en CI sin configuración extra                                                         |
| 2   | Refresh tokens en DB (`RefreshToken` table)                     | Stateless refresh (signed JWT only) | Permite revocar tokens en logout; rotation trackeable                                                                     |
| 3   | `jsonwebtoken` directo en `auth-utils`                          | `@nestjs/jwt` en la lib             | `auth-utils` debe ser zero-framework; NestJS usa `JwtModule.register()` internamente pero los helpers de la lib son puros |
| 4   | Un `AuthModule` por feature (no monolithic `AppModule`)         | Todo en `AppModule`                 | NestJS best practice — `AppModule` solo importa `AuthModule`                                                              |
| 5   | Repository interface en dominio, implementación Prisma separada | Acceso directo a Prisma en Service  | Testabilidad: los use cases se testean con repositorio mockeado                                                           |
| 6   | `tsconfig.app.json` — mantener `node16` por ahora               | Migrar a `bundler`                  | SWC transpila ok; migración tsconfig es un change de cleanup separado                                                     |
| 7   | `libs/auth/utils/tsconfig.json` — actualizar a `bundler`        | Mantener `node16`                   | Consistencia con `shared-types`; esta lib también es pure TS                                                              |

---

## Data Flow

```
POST /auth/login
       │
       ▼
  AuthController          (HTTP layer — delegate only)
       │  LoginDto (Zod validated)
       ▼
  AuthService             (Application layer — orchestrate)
       │  email + password
       ▼
  LoginUseCase            (Domain layer — pure business logic)
       │  IUserRepository.findByEmail()
       ▼
  PrismaUserRepository    (Infrastructure layer — Prisma adapter)
       │  user record
       ▼
  LoginUseCase            (validates password hash, creates tokens)
       │  signAccessToken() + signRefreshToken() via auth-utils
       ▼
  AuthService → AuthController → Response { accessToken, refreshToken }
```

---

## File Changes

### apps/auth-service

| File                                                  | Action | Description                                       |
| ----------------------------------------------------- | ------ | ------------------------------------------------- |
| `prisma/schema.prisma`                                | Create | User + RefreshToken models                        |
| `src/main.ts`                                         | Modify | Agregar `ValidationPipe` global                   |
| `src/app/app.module.ts`                               | Modify | Importar `AuthModule`                             |
| `src/auth/auth.module.ts`                             | Create | NestJS module con providers                       |
| `src/auth/auth.controller.ts`                         | Create | 4 rutas: register/login/refresh/logout            |
| `src/auth/auth.service.ts`                            | Create | Orquesta use cases                                |
| `src/auth/guards/jwt-auth.guard.ts`                   | Create | `JwtAuthGuard` usando Passport                    |
| `src/auth/strategies/jwt.strategy.ts`                 | Create | `JwtStrategy` (passport-jwt)                      |
| `src/auth/dto/register.dto.ts`                        | Create | `RegisterDto` validado con Zod                    |
| `src/auth/dto/login.dto.ts`                           | Create | `LoginDto` validado con Zod                       |
| `src/auth/dto/refresh.dto.ts`                         | Create | `RefreshDto` validado con Zod                     |
| `src/domain/user/user.entity.ts`                      | Create | `User` entity (pure TS)                           |
| `src/domain/user/i-user.repository.ts`                | Create | `IUserRepository` interface                       |
| `src/domain/use-cases/register.use-case.ts`           | Create | `RegisterUseCase`                                 |
| `src/domain/use-cases/login.use-case.ts`              | Create | `LoginUseCase`                                    |
| `src/domain/use-cases/refresh.use-case.ts`            | Create | `RefreshUseCase`                                  |
| `src/domain/use-cases/logout.use-case.ts`             | Create | `LogoutUseCase`                                   |
| `src/infrastructure/prisma/prisma.service.ts`         | Create | `PrismaService extends PrismaClient`              |
| `src/infrastructure/prisma/prisma-user.repository.ts` | Create | `PrismaUserRepository implements IUserRepository` |

### libs/auth/utils

| File                         | Action | Description                                                                                 |
| ---------------------------- | ------ | ------------------------------------------------------------------------------------------- |
| `src/lib/auth-utils.ts`      | Modify | Reemplazar placeholder: `signAccessToken`, `signRefreshToken`, `verifyToken`, `decodeToken` |
| `src/lib/auth-utils.spec.ts` | Modify | Tests reales para los helpers                                                               |
| `tsconfig.json`              | Modify | `module: "esnext"`, `moduleResolution: "bundler"`                                           |
| `package.json`               | Modify | Agregar `jsonwebtoken` como `peerDependency`                                                |

### Root

| File           | Action | Description                                                                                                           |
| -------------- | ------ | --------------------------------------------------------------------------------------------------------------------- |
| `package.json` | Modify | `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcryptjs`, `jsonwebtoken`, `prisma`, `@prisma/client` |

---

## Interfaces / Contracts

```typescript
// IUserRepository — dominio puro
interface IUserRepository {
  findByEmail(email: string, tenantId: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  saveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void>;
  findRefreshToken(token: string): Promise<RefreshToken | null>;
  revokeRefreshToken(token: string): Promise<void>;
}

// JWT payload shape
interface JwtPayload {
  sub: string; // userId
  email: string;
  role: UserRole;
  tenantId: string;
}
```

---

## Testing Strategy

| Layer | What to Test                                                            | Approach                                       |
| ----- | ----------------------------------------------------------------------- | ---------------------------------------------- |
| Unit  | Use cases: RegisterUseCase, LoginUseCase, RefreshUseCase, LogoutUseCase | Jest — mock `IUserRepository`, assert behavior |
| Unit  | `auth-utils` helpers: sign/verify/decode                                | Jest — round-trip + expired token              |
| Unit  | DTOs: Zod schema validation                                             | Jest — `safeParse` happy + error cases         |

---

## Migration / Rollout

1. Instalar dependencias (`pnpm add -w ...`)
2. Crear `prisma/schema.prisma` con `User` + `RefreshToken`
3. Generar migration local: `pnpm exec prisma migrate dev --name init-auth` (requiere PostgreSQL corriendo)
4. Implementar código
5. Tests

---

## Open Questions

- [ ] **`DATABASE_URL` env var**: ¿Se configura via `@saas/config-env` (la lib de config) o directamente en `process.env.DATABASE_URL`? Por ahora: `process.env.DATABASE_URL` directamente en `PrismaService` para mantener el scope. Config-env es un change separado.
- [ ] **JWT_SECRET en env**: Hardcodeado para tests, leído de `process.env.JWT_SECRET` en runtime. Sin validación de env vars en este change (eso va en config-env).
