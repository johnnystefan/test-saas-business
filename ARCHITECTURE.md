# BFF — API Gateway Architecture

## What is the BFF?

The **Backend for Frontend (BFF)** is the single entry point for all mobile clients. Its only job is to **authenticate the caller and forward the request** to the correct downstream microservice. It owns **no business logic** and **no database**.

```
Mobile App
    │
    ▼
┌─────────────┐
│     BFF     │  ← validates JWT + country, strips prefix, forwards
│  (API GW)   │
└──────┬──────┘
       │
   ┌───┴──────────────────┐
   │                      │
   ▼                      ▼
linebreaker-ar        linebreaker-co
(Argentina)           (Colombia)
```

---

## Runtime: How a request travels

For a mobile request `POST /api/v1/argentina/transactions` with a JWT in the header:

```
1. FastifyAdapter receives request
2. JwtAuthGuard verifies JWT signature
3. CountryGuard checks token country claim === Country.ARGENTINA
4. Controller delegates to ArgentinaProxyService.proxyToArgentina(req, reply)
5. HttpProxyService builds the target URL:
      /api/v1/argentina/transactions
        → strip "/api/v1/argentina"  →  /transactions
        → add "/api/v1"              →  /api/v1/transactions
        → prepend ARGENTINA_SERVICE_URL (e.g. http://linebreaker-ar:3000)
      result: http://linebreaker-ar:3000/api/v1/transactions
6. @fastify/reply-from plugin pipes the full HTTP request (method, body,
   headers, query params) to the target URL, streams the response back.
7. Controller checks Result: isErr() → throw InternalServerErrorException
                             isOk()  → response already streamed, nothing to do
```

The response from the downstream service arrives unchanged at the mobile client.

---

## Project Structure

```
apps/bff/src/
├── main.ts                        # Fastify bootstrap + @fastify/reply-from registration
└── app/
    ├── app.module.ts              # Root module: wires proxy modules + shared infra
    ├── health/                    # /health liveness probe
    ├── proxy-argentina/           # One module per downstream service
    │   ├── proxy.constants.ts     # Service URL + route prefix constants
    │   ├── proxy.module.ts        # NestJS module: controllers + providers
    │   ├── controllers/           # One controller file per domain resource
    │   │   ├── auth-proxy.controller.ts
    │   │   ├── transactions-proxy.controller.ts
    │   │   ├── products-proxy.controller.ts
    │   │   └── stores-proxy.controller.ts
    │   ├── dtos/
    │   │   └── proxy.dto.ts       # Swagger-only DTOs (nestjs-zod)
    │   └── services/
    │       └── proxy.service.ts   # Calls HttpProxyService with route config
    └── proxy-colombia/            # Identical structure, different URL/prefix
        └── ...
```

---

## Layer breakdown

### 1. `main.ts` — Fastify bootstrap

Registers the `@fastify/reply-from` plugin before the app starts. This plugin is what makes streaming HTTP forwarding possible. If it is missing, every proxy call fails at runtime.

```typescript
await fastifyAdapter.getInstance().register(require('@fastify/reply-from'), {
  http: { requestOptions: { timeout: 30_000 } },
});
```

### 2. `proxy.constants.ts` — Configuration source of truth

```typescript
export const ARGENTINA_SERVICE_URL = secrets.ARGENTINA_INTERNAL_API_ENDPOINT;
export const ARGENTINA_PREFIX = '/api/v1/argentina';
```

These two constants fully describe **where to forward** and **what prefix to strip**. All other files import from here — change the URL in one place, everything follows.

### 3. `proxy.service.ts` — Route configuration wrapper

```typescript
@Injectable()
export class ArgentinaProxyService {
  constructor(private readonly httpProxyService: HttpProxyService) {}

  async proxyToArgentina(req: FastifyRequest, reply: FastifyReply): Promise<ProxyResult> {
    return this.httpProxyService.forwardRequest({
      request: req,
      reply,
      config: {
        targetUrl: ARGENTINA_SERVICE_URL,
        routeTransform: {
          stripPrefix: ARGENTINA_PREFIX,  // removes /api/v1/argentina
          addPrefix: '/api/v1',           // adds /api/v1
        },
      },
      startTime: Date.now(),
    });
  }
}
```

One method. One responsibility: configure and trigger the forward. The actual transport layer lives in `HttpProxyService`.

### 4. Controllers — Zero logic, full Swagger documentation

Controllers declare the endpoint surface area and documentation. The body of every handler is identical:

```typescript
async anyMethod(@Req() req: FastifyRequest, @Res() reply: FastifyReply): Promise<void> {
  const result = await this.proxyService.proxyToArgentina(req, reply);
  if (result.isErr()) {
    this.logger.error('...', { error: result.error });
    throw new InternalServerErrorException('Service unavailable');
  }
}
```

Two concerns only:
- **Document the endpoint** via `@ApiOperation`, `@ApiParam`, `@ApiResponse`
- **Handle the error case** from the Result

Params (`@Param`, `@Query`, `@Body`) are declared in the method signature purely to drive Swagger generation. They are never read — the proxy forwards the raw Fastify request.

### 5. `HttpProxyService` (lib) — Transport engine

Lives in `libs/http-proxy`. Three steps:

| Step | What it does |
|------|-------------|
| `validateConfig` | Guards against empty/invalid `targetUrl` |
| `buildTargetUrl` | Applies `stripPrefix` + `addPrefix` to the incoming path |
| `executeProxy` | Calls `reply.from(targetUrl)` — @fastify/reply-from streams the full request+response |

Returns `Result<ProxySuccess, ProxyError>` (neverthrow). The controller checks `isErr()`.

### 6. Guards — JWT + Country routing

Applied at controller class level, not per-method:

```typescript
@UseGuards(JwtAuthGuard, CountryGuard)
@CountryAllowed(Country.ARGENTINA)
@Controller('argentina/transactions')
export class ArgentinaTransactionsProxyController { ... }
```

`JwtAuthGuard`: validates the JWT signature and expiry.  
`CountryGuard` + `@CountryAllowed`: reads the `country` claim from the decoded token and rejects requests from the wrong country. This prevents Argentina users from hitting Colombia endpoints and vice versa.

---

## Route transformation table

| Incoming (BFF) | Stripped | After addPrefix | Forwarded to |
|----------------|----------|-----------------|--------------|
| `POST /api/v1/argentina/transactions` | `/transactions` | `/api/v1/transactions` | `linebreaker-ar/api/v1/transactions` |
| `GET /api/v1/argentina/transactions/123` | `/transactions/123` | `/api/v1/transactions/123` | `linebreaker-ar/api/v1/transactions/123` |
| `GET /api/v1/argentina/products/search?code=ABC` | `/products/search?code=ABC` | `/api/v1/products/search?code=ABC` | `linebreaker-ar/api/v1/products/search?code=ABC` |
| `POST /api/v1/colombia/transactions` | `/transactions` | `/api/v1/transactions` | `linebreaker-co/api/v1/transactions` |

Query strings, headers, and the request body are forwarded transparently by `@fastify/reply-from`.

---

## Adding a new service

To expose a new downstream microservice through the BFF:

1. **Create `proxy-{service}/` folder** (copy the argentina structure)
2. **`proxy.constants.ts`** — set `SERVICE_URL` and `PREFIX`
3. **`proxy.service.ts`** — inject `HttpProxyService`, configure `routeTransform`
4. **Controllers** — one file per domain resource, all handlers delegate to the service
5. **`proxy.module.ts`** — register controllers + `HttpProxyService` + new proxy service
6. **`app.module.ts`** — import the new module

No changes to `main.ts`, no changes to existing modules.

---

## Dependencies

| Package | Role |
|---------|------|
| `@fastify/reply-from` | Streams HTTP requests to upstream services |
| `@linebreaker/http-proxy` | Wraps `reply.from` with typed Result and route transforms |
| `@linebreaker/shared/nestjs` | `JwtAuthGuard`, `CountryGuard`, `SharedAuthModule` |
| `neverthrow` | `Result<T, E>` for error handling without exceptions |
| `nestjs-zod` | Zod-powered DTOs for Swagger documentation |
