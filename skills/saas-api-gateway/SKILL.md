# saas-api-gateway — BFF API Gateway Pattern

## What is the BFF?

The **Backend for Frontend (BFF)** is the **single entry point** for all client apps (mobile + admin). It owns **zero business logic** and **zero persistence**. Its only responsibilities:

1. Authenticate the caller (JWT guard)
2. Forward the raw HTTP request to the correct downstream microservice
3. Stream the response back untouched
4. Handle forwarding errors uniformly via `Result<T,E>`

```
Client (Mobile/Admin)
        │
        ▼
  ┌───────────┐
  │    BFF    │  ← validates JWT, strips prefix, forwards
  │ api-gw    │
  └─────┬─────┘
        │
   ┌────┴──────────────────────┐
   ▼          ▼                ▼
auth-svc   club-svc      booking-svc  ...
```

---

## Project Structure

```
apps/api-gateway/src/
├── main.ts                         # Fastify bootstrap + @fastify/reply-from registration
└── app/
    ├── app.module.ts               # Root module: imports all proxy modules
    ├── health/                     # GET /health liveness probe
    ├── proxy-auth/                 # One module per downstream microservice
    │   ├── proxy.constants.ts      # SERVICE_URL + PREFIX — single source of truth
    │   ├── proxy.module.ts         # NestJS module: controllers + providers
    │   ├── controllers/            # One file per domain resource
    │   │   └── auth-proxy.controller.ts
    │   └── services/
    │       └── proxy.service.ts    # Calls HttpProxyService with route config
    ├── proxy-club/
    ├── proxy-booking/
    ├── proxy-inventory/
    └── proxy-finance/

libs/shared/http-proxy/src/         # Reusable transport engine — NOT in apps/
├── index.ts
├── http-proxy.service.ts           # The ONLY class that calls reply.from()
└── types/
    ├── transform.types.ts          # RouteTransform, ProxyConfig
    ├── config.types.ts             # ProxyContext
    └── proxy.types.ts              # ProxyResult, ProxySuccess, ProxyError
```

---

## Required packages

```bash
pnpm add @fastify/reply-from neverthrow
pnpm add -D @types/node
```

---

## Bootstrap: `main.ts`

`@fastify/reply-from` MUST be registered BEFORE `NestFactory.create`. Without this, `reply.from()` doesn't exist at runtime — every proxy call fails silently.

```typescript
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();

  await fastifyAdapter.getInstance().register(require('@fastify/reply-from'), {
    http: {
      requestOptions: { timeout: 30_000 },
    },
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  await app.listen(3000, '0.0.0.0');
}

bootstrap();
```

---

## Library: `HttpProxyService` (lives in `libs/shared/http-proxy`)

**NEVER call `reply.from()` from anywhere else.** This is the transport engine.

### Types

```typescript
// types/transform.types.ts
export type RouteTransform = {
  readonly stripPrefix?: string;
  readonly addPrefix?: string;
};

export type ProxyConfig = {
  readonly targetUrl: string;
  readonly routeTransform?: RouteTransform;
};

// types/config.types.ts
import type { FastifyReply, FastifyRequest } from 'fastify';

export type ProxyContext = {
  readonly request: FastifyRequest;
  readonly reply: FastifyReply;
  readonly config: ProxyConfig;
  readonly startTime: number;
};

// types/proxy.types.ts
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

### Service

```typescript
// http-proxy.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { err, ok, Result } from 'neverthrow';

@Injectable()
export class HttpProxyService {
  private readonly logger = new Logger(HttpProxyService.name);

  async forwardRequest(context: ProxyContext): Promise<ProxyResult> {
    const { request, config } = context;

    const configResult = this.validatedConfig(config);
    if (configResult.isErr()) return err(configResult.error);

    const urlResult = this.builtTargetUrl(request.url, config);
    if (urlResult.isErr()) return err(urlResult.error);

    return this.executedProxy(context, urlResult.value);
  }

  private validatedConfig(config: ProxyConfig): Result<void, ProxyError> {
    if (!config.targetUrl) {
      return err({ code: 'INVALID_CONFIG', message: 'Target URL is required' });
    }
    try {
      new URL(config.targetUrl);
      return ok(void 0);
    } catch {
      return err({
        code: 'INVALID_CONFIG',
        message: 'Invalid target URL',
        targetUrl: config.targetUrl,
      });
    }
  }

  private builtTargetUrl(
    originalPath: string,
    config: ProxyConfig,
  ): Result<string, ProxyError> {
    try {
      const transformed = config.routeTransform
        ? this.transformedRoute(originalPath, config.routeTransform)
        : originalPath;
      const base = config.targetUrl.endsWith('/')
        ? config.targetUrl.slice(0, -1)
        : config.targetUrl;
      const full = `${base}${transformed}`;
      new URL(full);
      return ok(full);
    } catch (error) {
      return err({
        code: 'INVALID_CONFIG',
        message: 'Failed to build target URL',
        originalPath,
        cause: error,
      });
    }
  }

  private transformedRoute(path: string, transform: RouteTransform): string {
    let result = path;
    if (transform.stripPrefix && result.startsWith(transform.stripPrefix)) {
      result = result.slice(transform.stripPrefix.length);
    }
    if (transform.addPrefix) {
      result = transform.addPrefix + result;
    }
    return result.startsWith('/') ? result : `/${result}`;
  }

  private async executedProxy(
    context: ProxyContext,
    targetUrl: string,
  ): Promise<Result<ProxySuccess, ProxyError>> {
    const { request, reply, startTime } = context;
    try {
      const replyWithFrom = reply as unknown as {
        from: (url: string) => Promise<void>;
      };
      if (typeof replyWithFrom.from !== 'function') {
        throw new TypeError('@fastify/reply-from plugin not registered');
      }
      await replyWithFrom.from(targetUrl);
      return ok({
        statusCode: reply.statusCode,
        headers: reply.getHeaders() as Record<string, string>,
        targetUrl,
        duration: Date.now() - startTime,
      });
    } catch (error) {
      return err({
        code: 'PROXY_ERROR',
        message: (error as Error).message,
        targetUrl,
        originalPath: request.url,
        cause: error,
      });
    }
  }
}
```

---

## Proxy module pattern (one per downstream service)

### `proxy.constants.ts` — Single source of truth

```typescript
// The ONLY place that knows where to forward and what prefix to strip
export const AUTH_SERVICE_URL = process.env['AUTH_SERVICE_URL']!;
export const AUTH_PREFIX = '/api/v1/auth';
```

### `services/proxy.service.ts`

One method, one responsibility: configure and trigger the forward.

```typescript
@Injectable()
export class AuthProxyService {
  private readonly logger = new Logger(AuthProxyService.name);

  constructor(private readonly httpProxyService: HttpProxyService) {}

  async proxyToAuth(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<ProxyResult> {
    this.logger.debug(
      `Proxying to auth-service: ${request.method} ${request.url}`,
    );
    return this.httpProxyService.forwardRequest({
      request,
      reply,
      config: {
        targetUrl: AUTH_SERVICE_URL,
        routeTransform: {
          stripPrefix: AUTH_PREFIX, // removes /api/v1/auth
          addPrefix: '/api/v1', // restores /api/v1 for downstream
        },
      },
      startTime: Date.now(),
    });
  }
}
```

### Controllers — Zero logic, full Swagger docs

**The handler body is ALWAYS the same two lines.** Never read `@Param`, `@Body`, `@Query` — they exist only for Swagger.

```typescript
@ApiTags('Auth')
@Controller('auth') // NO JwtAuthGuard on auth endpoints
export class AuthProxyController {
  private readonly logger = new Logger(AuthProxyController.name);

  constructor(private readonly proxyService: AuthProxyService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'Created' })
  async register(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    const result = await this.proxyService.proxyToAuth(req, reply);
    if (result.isErr()) {
      this.logger.error('POST /auth/register proxy failed', {
        error: result.error,
      });
      throw new InternalServerErrorException('Auth service is unavailable');
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  async login(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    const result = await this.proxyService.proxyToAuth(req, reply);
    if (result.isErr()) {
      this.logger.error('POST /auth/login proxy failed', {
        error: result.error,
      });
      throw new InternalServerErrorException('Auth service is unavailable');
    }
  }
}
```

For protected routes, add `@UseGuards(JwtAuthGuard)` at class level:

```typescript
@UseGuards(JwtAuthGuard)
@Controller('club/students')
export class ClubStudentsProxyController { ... }
```

### `proxy.module.ts`

```typescript
@Module({
  imports: [SharedAuthModule.forRoot(process.env['JWT_SECRET']!)],
  controllers: [AuthProxyController],
  providers: [HttpProxyService, AuthProxyService],
  exports: [AuthProxyService],
})
export class AuthProxyModule {}
```

---

## Route transformation reference

| Incoming BFF path                            | stripPrefix       | addPrefix | Forwarded to                                   |
| -------------------------------------------- | ----------------- | --------- | ---------------------------------------------- |
| `POST /api/v1/auth/login`                    | `/api/v1/auth`    | `/api/v1` | `auth-service/api/v1/login`                    |
| `GET /api/v1/club/students/123`              | `/api/v1/club`    | `/api/v1` | `club-service/api/v1/students/123`             |
| `POST /api/v1/booking/slots?date=2026-01-01` | `/api/v1/booking` | `/api/v1` | `booking-service/api/v1/slots?date=2026-01-01` |

Query strings, HTTP method, all headers, and request body forward transparently.

---

## app.module.ts

```typescript
@Module({
  imports: [
    HealthModule,
    AuthProxyModule,
    ClubProxyModule,
    BookingProxyModule,
    InventoryProxyModule,
    FinanceProxyModule,
  ],
})
export class AppModule {}
```

---

## Conventions (non-negotiable)

| Rule                                                               | Why                                                             |
| ------------------------------------------------------------------ | --------------------------------------------------------------- |
| One controller file per domain resource                            | SRP — one reason to change                                      |
| NEVER read `@Param`/`@Body`/`@Query` in handlers                   | The proxy forwards the raw request; reading values is dead code |
| All handler bodies are identical (2 lines)                         | Consistency; business logic lives downstream                    |
| `proxy.constants.ts` is the ONLY place with URLs                   | Single source of truth                                          |
| `HttpProxyService` lives in `libs/shared/http-proxy`               | Reusable across services                                        |
| Return `Result<ProxySuccess, ProxyError>` (neverthrow)             | Forces error handling — no silent failures                      |
| `@UseGuards` at controller class level, never per-method           | Avoids repetition                                               |
| Auth endpoints (`/auth/register`, `/auth/login`) have NO JWT guard | Can't authenticate before you have a token                      |

---

## File checklist for a new downstream service

```
proxy-{service}/
├── proxy.constants.ts              # SERVICE_URL + PREFIX
├── proxy.module.ts                 # NestJS module
├── controllers/
│   └── {resource}-proxy.controller.ts   # one file per resource
└── services/
    └── proxy.service.ts            # wraps HttpProxyService
```

Then add `{Service}ProxyModule` to `app.module.ts`. Done.
