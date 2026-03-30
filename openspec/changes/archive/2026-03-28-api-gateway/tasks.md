# Tasks: API Gateway (BFF)

## Phase 1: Setup — Dependencias e Infraestructura

- [x] 1.1 **Instalar dependencias runtime**
      Ejecutar `pnpm add fastify @nestjs/platform-fastify @fastify/reply-from neverthrow` en la raíz del monorepo.
      **Archivos**: `package.json`, `pnpm-lock.yaml`
      **Criterio**: `pnpm list fastify @nestjs/platform-fastify @fastify/reply-from neverthrow` sin errores.

- [x] 1.2 **Crear estructura de carpetas `libs/shared/http-proxy/`**
      Crear directorios: `libs/shared/http-proxy/src/types/`.
      **Archivos**: solo directorios (sin archivos aún).
      **Criterio**: `ls libs/shared/http-proxy/src/types/` existe.

- [x] 1.3 **Crear archivos de configuración NX de la lib**
      Crear `libs/shared/http-proxy/project.json` (tags: `scope:shared, type:util`), `package.json`, `tsconfig.json`, `tsconfig.lib.json`, `tsconfig.spec.json`.
      **Archivos**: los 5 archivos de config.
      **Criterio**: `pnpm nx show project shared-http-proxy` muestra el proyecto sin errores.

- [x] 1.4 **Registrar path `@saas/http-proxy` en `tsconfig.base.json`**
      Agregar `"@saas/http-proxy": ["libs/shared/http-proxy/src/index.ts"]` en la sección `paths`.
      **Archivos**: `tsconfig.base.json`
      **Criterio**: `import {} from '@saas/http-proxy'` resuelve sin error TS.

- [x] 1.5 **Actualizar tags en `apps/api-gateway/project.json`**
      Cambiar `"scope:customer"` → `"scope:shared"` en el array `tags`.
      **Archivos**: `apps/api-gateway/project.json`
      **Criterio**: `pnpm nx show project api-gateway --json | jq .tags` contiene `"scope:shared"`.

---

## Phase 2: Core — Lib `http-proxy`

- [x] 2.1 **Crear tipos de la lib** _(requiere 1.2)_
      Crear `libs/shared/http-proxy/src/types/transform.types.ts` (`RouteTransform`, `ProxyConfig`), `config.types.ts` (`ProxyContext`), `proxy.types.ts` (`ProxyResult`, `ProxySuccess`, `ProxyError`).
      **Archivos**: 3 archivos de tipos.
      **Criterio**: Compilación TS sin errores en los 3 archivos.

- [x] 2.2 **Implementar `HttpProxyService`** _(requiere 2.1)_
      Crear `libs/shared/http-proxy/src/http-proxy.service.ts` con los 4 métodos: `forwardRequest`, `validatedConfig`, `builtTargetUrl`, `transformedRoute`, `executedProxy`. Usar `neverthrow` para retornar `Result<ProxySuccess, ProxyError>`.
      **Archivos**: `libs/shared/http-proxy/src/http-proxy.service.ts`
      **Criterio**: No usa `try/catch` global; todos los caminos de error retornan `err(...)`.

- [x] 2.3 **Crear `HttpProxyModule` y barrel export** _(requiere 2.2)_
      Crear `libs/shared/http-proxy/src/http-proxy.module.ts` que exporta `HttpProxyService`. Crear `libs/shared/http-proxy/src/index.ts` con barrel de todos los símbolos públicos.
      **Archivos**: `http-proxy.module.ts`, `index.ts`
      **Criterio**: `import { HttpProxyService, HttpProxyModule } from '@saas/http-proxy'` compila.

---

## Phase 3: Tests — `HttpProxyService`

- [x] 3.1 **Tests de `validatedConfig`** _(requiere 2.2)_
      Crear `libs/shared/http-proxy/src/http-proxy.service.spec.ts`. Cubrir: `targetUrl` vacío → `err(INVALID_CONFIG)`; URL inválida → `err(INVALID_CONFIG)`; URL válida → `ok()`.
      **Archivos**: `libs/shared/http-proxy/src/http-proxy.service.spec.ts`
      **Criterio**: 3 casos pasan con `pnpm nx test shared-http-proxy`.

- [x] 3.2 **Tests de `builtTargetUrl` / `transformedRoute`** _(requiere 3.1)_
      Cubrir: strip + add prefix correcto; sin transform usa path original; trailing slash en `targetUrl`; path resultante sin `/` inicial.
      **Archivos**: `http-proxy.service.spec.ts` (continúa)
      **Criterio**: 4 casos pasan.

- [x] 3.3 **Tests de forwarding exitoso y errores de red** _(requiere 3.2)_
      Cubrir: `reply.from()` llamado con URL transformada → retorna `ok(ProxySuccess)`; `reply.from` lanza → `err(PROXY_ERROR)` con `cause`; `reply.from` no existe → `err(PROXY_ERROR)` con mensaje "not registered".
      **Archivos**: `http-proxy.service.spec.ts` (continúa)
      **Criterio**: 3 casos pasan. Total: `pnpm nx test shared-http-proxy` ≥ 10 tests verdes.

---

## Phase 4: Bootstrap — Fastify en `api-gateway`

- [x] 4.1 **Refactor `main.ts` a Fastify** _(requiere 1.1, 2.3)_
      Reemplazar bootstrap Express por: (1) `new FastifyAdapter({ bodyLimit: 10_485_760 })`, (2) `await adapter.getInstance().register(import('@fastify/reply-from'), ...)` ANTES de `NestFactory.create`, (3) `app.setGlobalPrefix('api/v1', { exclude: ['health'] })`, (4) `app.enableCors(...)`, (5) `app.listen(PORT, '0.0.0.0')`.
      **Archivos**: `apps/api-gateway/src/main.ts`
      **Criterio**: Orden estricto: `@fastify/reply-from` registrado antes de `NestFactory.create`.

---

## Phase 5: Health Endpoint

- [x] 5.1 **Implementar `HealthModule`** _(requiere 4.1)_
      Crear `apps/api-gateway/src/app/health/health.controller.ts` con `GET /health` → `{ status: 'ok', timestamp, version }` (sin prefix global). Crear `apps/api-gateway/src/app/health/health.module.ts`.
      **Archivos**: `health.controller.ts`, `health.module.ts`
      **Criterio**: `curl localhost:3000/health` retorna `{ "status": "ok" }` con HTTP 200.

---

## Phase 6: Proxy Auth — Módulo completo

- [x] 6.1 **Crear constantes y tipos del módulo auth** _(requiere 4.1)_
      Crear `apps/api-gateway/src/app/proxy-auth/proxy.constants.ts` con `AUTH_SERVICE_URL` (desde env, fallback `http://localhost:3001`) y `AUTH_PREFIX = '/api/v1/auth'`.
      **Archivos**: `proxy-auth/proxy.constants.ts`
      **Criterio**: Constantes exportadas y tipadas.

- [x] 6.2 **Implementar `AuthProxyService`** _(requiere 6.1, 2.3)_
      Crear `apps/api-gateway/src/app/proxy-auth/services/auth-proxy.service.ts`. Método único `proxyToAuth(req, reply)` que llama `HttpProxyService.forwardRequest` con `{ targetUrl: AUTH_SERVICE_URL, routeTransform: { stripPrefix: AUTH_PREFIX, addPrefix: '/api/v1' } }`.
      **Archivos**: `proxy-auth/services/auth-proxy.service.ts`
      **Criterio**: No contiene lógica HTTP directa, solo configuración y delegación.

- [x] 6.3 **Implementar `AuthProxyController`** _(requiere 6.2)_
      Crear `apps/api-gateway/src/app/proxy-auth/controllers/auth-proxy.controller.ts`. Endpoints: `POST register`, `POST login`, `POST refresh` (sin guard), `POST logout` (`@UseGuards(JwtAuthGuard)` solo en ese método). Cada handler: exactamente 2 líneas.
      **Archivos**: `proxy-auth/controllers/auth-proxy.controller.ts`
      **Criterio**: Ningún handler usa `@Body()`, `@Param()`, `@Query()`.

- [x] 6.4 **Crear `ProxyAuthModule` y test de compilación** _(requiere 6.3)_
      Crear `apps/api-gateway/src/app/proxy-auth/proxy-auth.module.ts` declarando `AuthProxyController` y proveyendo `[HttpProxyModule, AuthProxyService]`. Agregar test de módulo en `proxy-auth.module.spec.ts`: `moduleRef.get(AuthProxyController)` no null.
      **Archivos**: `proxy-auth.module.ts`, `proxy-auth.module.spec.ts`
      **Criterio**: Test de módulo pasa con `pnpm nx test api-gateway`.

---

## Phase 7: Esqueletos — Otros módulos proxy

- [x] 7.1 **Crear esqueleto `proxy-club`** _(requiere 4.1)_
      Crear `proxy.constants.ts` (`CLUB_SERVICE_URL`, `CLUB_PREFIX`), `proxy-club.module.ts`, `controllers/club-proxy.controller.ts` (controller vacío con `@Controller('club')` y comentario `// TODO: implement when service is ready`).
      **Archivos**: 3 archivos en `proxy-club/`
      **Criterio**: Módulo importable sin errores de compilación TS.

- [x] 7.2 **Crear esqueleto `proxy-booking`** _(requiere 4.1)_
      Igual que 7.1 para booking: `BOOKING_SERVICE_URL`, `BOOKING_PREFIX`, `@Controller('booking')`.
      **Archivos**: 3 archivos en `proxy-booking/`
      **Criterio**: Módulo importable sin errores de compilación TS.

- [x] 7.3 **Crear esqueleto `proxy-inventory`** _(requiere 4.1)_
      Igual que 7.1 para inventory: `INVENTORY_SERVICE_URL`, `INVENTORY_PREFIX`, `@Controller('inventory')`.
      **Archivos**: 3 archivos en `proxy-inventory/`
      **Criterio**: Módulo importable sin errores de compilación TS.

- [x] 7.4 **Crear esqueleto `proxy-finance`** _(requiere 4.1)_
      Igual que 7.1 para finance: `FINANCE_SERVICE_URL`, `FINANCE_PREFIX`, `@Controller('finance')`.
      **Archivos**: 3 archivos en `proxy-finance/`
      **Criterio**: Módulo importable sin errores de compilación TS.

---

## Phase 8: Wiring — `AppModule`

- [x] 8.1 **Registrar todos los módulos en `app.module.ts`** _(requiere 5.1, 6.4, 7.1–7.4)_
      Modificar `apps/api-gateway/src/app/app.module.ts` para importar: `HealthModule`, `ProxyAuthModule`, `ProxyClubModule`, `ProxyBookingModule`, `ProxyInventoryModule`, `ProxyFinanceModule`.
      **Archivos**: `apps/api-gateway/src/app/app.module.ts`
      **Criterio**: `pnpm nx build api-gateway` compila sin errores; `pnpm nx test api-gateway` pasa.
