# Exploration: api-gateway

## Current State

`apps/api-gateway` es un NestJS placeholder generado por NX. Contiene:

- `src/main.ts` — bootstrap básico con Express (NO Fastify), `globalPrefix = 'api'` (sin versión, sin `/v1`)
- `src/app/app.module.ts` — módulo vacío que solo importa `AppController` + `AppService`
- `src/app/app.controller.ts` — un solo `GET /` que devuelve "Hello API"
- `src/app/app.service.ts` — placeholder
- `webpack.config.js` — compila con SWC, genera `package.json` de producción ✅
- `tsconfig.app.json` — usa `module: "node16"`, `moduleResolution: "node16"` (igual que auth-service antes del fix)
- `project.json` — tags: `scope:customer`, `type:bff`, `platform:node` ✅ (ya tiene el tag correcto)

**Fastify / `@fastify/reply-from` — NO instalados en el workspace:**

`package.json` root no tiene ni `fastify`, ni `@fastify/reply-from`, ni `@nestjs/platform-fastify`, ni `neverthrow`. Estos deben instalarse.

**Lo que SÍ está disponible:**

- `@nestjs/common`, `@nestjs/core`, `@nestjs/jwt`, `@nestjs/passport` ✅
- `nestjs-zod` ✅ (pero el BFF no valida bodies, no lo necesita directamente)
- `@saas/auth-utils` — `JwtPayload`, `verifyToken()`, `signAccessToken()` ✅
- `@saas/shared-types` — `UserSchema`, `UserRole`, `TenantedEntitySchema`, `DomainError` ✅

---

## Auth Service — Endpoints reales a proxiar

`apps/auth-service/src/auth/auth.controller.ts` expone bajo `api/v1/auth`:

| Método | Path                    | Guard        | HTTP Code |
| ------ | ----------------------- | ------------ | --------- |
| POST   | `/api/v1/auth/register` | ninguno      | 201       |
| POST   | `/api/v1/auth/login`    | ninguno      | 200       |
| POST   | `/api/v1/auth/refresh`  | ninguno      | 200       |
| POST   | `/api/v1/auth/logout`   | JwtAuthGuard | 204       |

**Patrón de transformación para auth:**

- BFF recibe: `POST /api/v1/auth/login`
- stripPrefix: `/api/v1/auth` → queda `/login`
- addPrefix: `/api/v1` → queda `/api/v1/login`
- Downstream recibe: `POST http://auth-service:3001/api/v1/login`

**Gotcha crítico:** `POST /auth/logout` en el auth-service usa `JwtAuthGuard` — el BFF TAMBIÉN debe tener `JwtAuthGuard` en ese endpoint. El skill dice que los endpoints de logout son protegidos y deben tener `@UseGuards(JwtAuthGuard)` en el BFF.

---

## Otros servicios del monorepo

Todos los servicios son NestJS placeholders (sin implementación real todavía):

| Servicio            | Estado          | Puerto (a definir) | Scope futuro del BFF |
| ------------------- | --------------- | ------------------ | -------------------- |
| `auth-service`      | ✅ Implementado | 3001               | `proxy-auth/`        |
| `club-service`      | Placeholder     | 3002               | `proxy-club/`        |
| `booking-service`   | Placeholder     | 3003               | `proxy-booking/`     |
| `inventory-service` | Placeholder     | 3004               | `proxy-inventory/`   |
| `finance-service`   | Placeholder     | 3005               | `proxy-finance/`     |

El change `api-gateway` debe crear la estructura de módulos proxy para los 5 servicios, aunque los módulos de club/booking/inventory/finance sean "esqueletos" (controllers vacíos) que se completarán cuando cada servicio esté implementado.

---

## Tipos compartidos disponibles en `libs/`

### `@saas/shared-types`

| Export                    | Descripción                                  |
| ------------------------- | -------------------------------------------- |
| `BaseEntitySchema`        | `{ id, createdAt, updatedAt }` — Zod schema  |
| `TenantedEntitySchema`    | Extiende Base + `tenantId`                   |
| `UserSchema`              | `email, name, role, status` + TenantedEntity |
| `UserRoleSchema`          | `USER_ROLE`: ADMIN, MANAGER, STAFF, CUSTOMER |
| `UserStatusSchema`        | `USER_STATUS`: ACTIVE, INACTIVE, PENDING     |
| `TenantSchema`            | Schema del tenant                            |
| `MemberSchema`            | Schema del miembro                           |
| `DomainError`             | Base abstract para errores de dominio        |
| `BusinessRuleViolation`   | Subtipo de DomainError                       |
| `DomainValidationError`   | Subtipo de DomainError                       |
| `InvalidArgumentError`    | Subtipo de DomainError                       |
| `apiResponseSchema`       | `{ data, message }` — wrapper genérico       |
| `paginatedResponseSchema` | `{ data[], total, page, pageSize }`          |
| `PaginationInputSchema`   | `{ page, pageSize }`                         |

### `@saas/auth-utils`

| Export                       | Descripción                             |
| ---------------------------- | --------------------------------------- |
| `JwtPayload`                 | `{ sub, email, role, tenantId }` — type |
| `TokenPair`                  | `{ accessToken, refreshToken }` — type  |
| `signAccessToken()`          | Firma JWT access token (15min)          |
| `signRefreshToken()`         | Firma JWT refresh token (7d)            |
| `verifyToken()`              | Verifica y decodifica un JWT            |
| `decodeToken()`              | Decodifica sin verificar                |
| `getRefreshTokenExpiresAt()` | Fecha de expiración del refresh token   |

### `@saas/config-env` — placeholder vacío

`libs/config/env/src/lib/config-env.ts` solo tiene `return 'config-env'`. El BFF debe leer env vars directamente (igual que auth-service).

### `@saas/shared-constants` — placeholder vacío

`libs/shared/constants/src/lib/shared-constants.ts` solo tiene `return 'shared-constants'`.

---

## Patrón exacto que dicta el skill `saas-api-gateway`

### Estructura de carpetas (skill define esto como canónico):

```
apps/api-gateway/src/
├── main.ts                          # Fastify bootstrap + @fastify/reply-from
└── app/
    ├── app.module.ts                # Importa todos los proxy modules
    ├── health/                      # GET /health liveness probe
    ├── proxy-auth/
    │   ├── proxy.constants.ts       # AUTH_SERVICE_URL + AUTH_PREFIX
    │   ├── proxy.module.ts          # NestJS module
    │   ├── controllers/
    │   │   └── auth-proxy.controller.ts
    │   └── services/
    │       └── proxy.service.ts
    ├── proxy-club/
    ├── proxy-booking/
    ├── proxy-inventory/
    └── proxy-finance/

libs/shared/http-proxy/src/          # Motor de transporte — NUEVA LIB
├── index.ts
├── http-proxy.service.ts            # ÚNICO lugar que llama reply.from()
└── types/
    ├── transform.types.ts
    ├── config.types.ts
    └── proxy.types.ts
```

### Reglas no negociables del skill:

1. `@fastify/reply-from` DEBE registrarse ANTES de `NestFactory.create` — sin esto `reply.from()` no existe en runtime
2. `HttpProxyService` vive en `libs/shared/http-proxy` (nueva lib), NO en `apps/`
3. Los handlers de controllers son SIEMPRE 2 líneas idénticas (call + error check)
4. NUNCA leer `@Param`/`@Body`/`@Query` en handlers (la proxy reenvía el request raw)
5. `proxy.constants.ts` es la ÚNICA fuente de verdad para URLs de servicios
6. Endpoints de auth (`/register`, `/login`, `/refresh`) van SIN `JwtAuthGuard`
7. Endpoint `/logout` del auth va CON `JwtAuthGuard` (porque el auth-service lo requiere)
8. `@UseGuards` siempre a nivel de clase, nunca por método
9. Retornar `Result<ProxySuccess, ProxyError>` con `neverthrow` — sin fallos silenciosos

---

## Affected Areas

- `apps/api-gateway/src/main.ts` — Reemplazar Express bootstrap por Fastify + `@fastify/reply-from`
- `apps/api-gateway/src/app/app.module.ts` — Reemplazar por módulo root que importa proxy modules + health
- `apps/api-gateway/src/app/app.controller.ts` — Eliminar (reemplazado por módulos proxy)
- `apps/api-gateway/src/app/app.service.ts` — Eliminar (sin business logic en el BFF)
- `apps/api-gateway/src/app/health/` — Crear health module
- `apps/api-gateway/src/app/proxy-auth/` — Crear módulo completo (4 endpoints reales)
- `apps/api-gateway/src/app/proxy-club/` — Crear estructura (controllers vacíos / esqueleto)
- `apps/api-gateway/src/app/proxy-booking/` — Crear estructura (controllers vacíos / esqueleto)
- `apps/api-gateway/src/app/proxy-inventory/` — Crear estructura (controllers vacíos / esqueleto)
- `apps/api-gateway/src/app/proxy-finance/` — Crear estructura (controllers vacíos / esqueleto)
- `libs/shared/http-proxy/` — **Nueva lib** — `HttpProxyService` + tipos (`ProxyResult`, `ProxyConfig`, etc.)
- `package.json` (root) — Instalar: `@nestjs/platform-fastify`, `fastify`, `@fastify/reply-from`, `neverthrow`

---

## Approaches

### Opción A — Solo proxy-auth funcional + esqueletos de otros módulos

Implementar `proxy-auth` completo (los 4 endpoints reales del auth-service), crear la lib `shared/http-proxy`, y dejar `proxy-club`, `proxy-booking`, `proxy-inventory`, `proxy-finance` como estructuras vacías (módulos declarados pero sin controllers implementados).

- **Pros**: Funcional end-to-end para auth (que es el único servicio implementado), scope ajustado, testaable
- **Cons**: El BFF no está listo para cuando se implementen los otros servicios
- **Esfuerzo**: Medio

### Opción B — BFF completo con todos los módulos proxy estructurados (recomendado)

Implementar la lib `shared/http-proxy`, bootstrap Fastify, y crear TODOS los módulos proxy (`proxy-auth`, `proxy-club`, `proxy-booking`, `proxy-inventory`, `proxy-finance`) con su estructura canónica. `proxy-auth` tendrá controllers con los 4 endpoints reales. Los demás tendrán al menos un controller con un endpoint placeholder (GET /{resource}) para que la estructura esté lista y solo haya que agregar métodos cuando se implementen los servicios.

- **Pros**: El BFF queda estructuralmente completo, los demás services solo necesitan agregar endpoints; consistencia arquitectural desde el inicio
- **Cons**: Más archivos para crear, pero la mayoría son boilerplate mínimo
- **Esfuerzo**: Medio-Alto (pero predecible)

### Opción C — BFF completo + tests de integración con supertest

Igual que B, más tests de integración reales contra el auth-service (usando TestingModule de NestJS + supertest para probar que el proxy funciona).

- **Pros**: Cobertura total, detecta problemas de configuración de Fastify
- **Cons**: Requiere auth-service corriendo (o mock complejo), aumenta scope del change
- **Esfuerzo**: Alto

---

## Recommendation

**Opción B** — BFF completo estructuralmente. Justificación:

1. El auth-service ya está implementado → `proxy-auth` puede tener controllers REALES (no placeholders)
2. Los 4 servicios restantes son placeholders pero el BFF debe estar listo → crear estructura canónica vacía es trivial
3. La lib `shared/http-proxy` es reutilizable y debe nacer desde el primer change del BFF
4. Omitir los módulos proxy vacíos crea deuda técnica que bloquea futuros changes de club/booking/etc.

Para tests: Unit tests del `HttpProxyService` con mocks de Fastify, NO tests de integración contra el auth-service real (eso va en un change de E2E posterior).

---

## Risks

1. **`@fastify/reply-from` debe registrarse ANTES de `NestFactory.create`** — si el orden cambia, `reply.from()` no existe en runtime y cada proxy call falla silenciosamente. El skill lo documenta explícitamente.

2. **`NestFastifyApplication` vs `NestApplication`** — el BFF actual usa Express. Cambiar a Fastify requiere también actualizar cualquier middleware Express-específico. En este caso el BFF está vacío, entonces es limpio.

3. **Prefix conflict**: El auth-service usa `globalPrefix = 'api/v1'` → los endpoints reales son `POST /api/v1/auth/register`. El BFF debe hacer `stripPrefix: '/api/v1/auth'` + `addPrefix: '/api/v1'` para que el downstream reciba `/api/v1/register`. Si el stripPrefix es incorrecto, el downstream devuelve 404 y el proxy falla silenciosamente (salvo que el `Result` lo capture).

4. **`tsconfig.app.json` usa `node16`** — igual que en auth-service. SWC transpila correctamente en runtime pero puede generar warnings. Decisión: mantener `node16` por ahora (consistente con auth-service), cleanup en change separado.

5. **`scope:customer` en `project.json`** — El tag actual dice `scope:customer`. Según las NX boundaries, el api-gateway sirve tanto a admin como a customer. Revisar si el tag debe ser `scope:shared` o mantener `scope:customer`. Por ahora mantener ya que el skill no menciona cambiar tags.

6. **Lib `shared/http-proxy` necesita estar en `tsconfig.base.json`** — al crear la nueva lib, hay que agregar el path `@saas/http-proxy` al `tsconfig.base.json` root. Si se omite, los imports fallan con module not found.

7. **neverthrow no está instalado** — debe instalarse como dependency del workspace. Sin esto, el `Result<T,E>` no compila.

---

## Ready for Proposal

Sí. El scope está claro:

1. Instalar deps: `@nestjs/platform-fastify`, `fastify`, `@fastify/reply-from`, `neverthrow`
2. Crear lib `libs/shared/http-proxy/` con `HttpProxyService` + tipos
3. Registrar `@saas/http-proxy` en `tsconfig.base.json`
4. Reemplazar `main.ts` de api-gateway con bootstrap Fastify
5. Implementar `proxy-auth` completo (4 endpoints — 3 públicos, 1 protegido)
6. Crear estructura canónica para `proxy-club`, `proxy-booking`, `proxy-inventory`, `proxy-finance` (esqueletos)
7. Health endpoint `GET /health`
8. Actualizar `app.module.ts` para importar todos los módulos
9. Tests unitarios del `HttpProxyService`
