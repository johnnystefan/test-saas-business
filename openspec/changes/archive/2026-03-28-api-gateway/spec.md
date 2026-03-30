# Specification: API Gateway (BFF)

## 1. Overview

Transform the Express-based NestJS API Gateway into a robust Fastify-based BFF that securely proxies requests to downstream microservices, starting with the auth-service.

## 2. Functional Requirements (Scenarios)

### 2.1 Proxy Authentication (Auth Service)

- **Scenario: Register**
  - **Given** a guest user
  - **When** they send a POST request to `/api/v1/auth/register`
  - **Then** the BFF should strip `/api/v1/auth`, add `/api/v1`, and proxy the request to `http://auth-service:PORT/api/v1/register`
  - **And** return the downstream response without modification.
- **Scenario: Login**
  - **Given** a guest user
  - **When** they send a POST request to `/api/v1/auth/login`
  - **Then** the BFF should proxy the request to the auth-service (`/api/v1/login`)
  - **And** return the downstream response (including tokens/cookies).
- **Scenario: Refresh Token**
  - **Given** a user with a valid refresh token
  - **When** they send a POST request to `/api/v1/auth/refresh`
  - **Then** the BFF should proxy the request to the auth-service (`/api/v1/refresh`)
- **Scenario: Logout**
  - **Given** an authenticated user (valid JWT)
  - **When** they send a POST request to `/api/v1/auth/logout`
  - **Then** the BFF should validate the JWT using `JwtAuthGuard`
  - **And** proxy the request to the auth-service (`/api/v1/logout`) if valid.

### 2.2 Health Check

- **Scenario: Liveness Probe**
  - **Given** any client (e.g., Kubernetes, Load Balancer)
  - **When** they send a GET request to `/health`
  - **Then** the BFF should return a 200 OK status with `{ "status": "ok" }`.

### 2.3 Service Skeletons

- **Scenario: Future Proxy Routes**
  - **Given** the system architecture
  - **When** the gateway initializes
  - **Then** it should load skeleton modules for `club`, `booking`, `inventory`, and `finance`.

## 3. Architecture & Non-Functional Requirements

### 3.1 Framework & Engine

- **Fastify Foundation**: The API Gateway must use `fastify` and `@nestjs/platform-fastify`.
- **Proxy Engine**: Must use `@fastify/reply-from` registered _before_ `NestFactory.create` in `main.ts`.
- **Shared Library**: The proxy logic must reside in `libs/shared/http-proxy` and be implemented as a reusable `HttpProxyService`.

### 3.2 Code Constraints (Strict)

1. **Two-Line Handlers**: Proxy route handlers must be exactly two lines: call proxy service and handle error.
   ```typescript
   @Post('login')
   async login(@Req() req: FastifyRequest, @Res() res: FastifyReply): Promise<void> {
     const result = await this.proxyService.forward(req, res, this.config.login);
     if (result.isErr()) this.handleProxyError(result.error, res);
   }
   ```
2. **No Payload Parsing**: NUNCA use `@Body()`, `@Param()`, or `@Query()` in BFF proxy handlers to avoid buffering the entire request.
3. **Guard Placement**: `@UseGuards` must be applied at the class level or specific methods (e.g., `JwtAuthGuard` on `logout`).

## 4. API Contracts & Route Transforms

### 4.1 Route Transformations

The `HttpProxyService` must support a `RouteTransform` configuration:

- `stripPrefix`: The prefix to remove from the incoming BFF request path.
- `addPrefix`: The prefix to prepend before forwarding to the downstream service.

**Example Transformation**:

```
BFF receives:  POST /api/v1/auth/login
stripPrefix:   /api/v1/auth  →  /login
addPrefix:     /api/v1       →  /api/v1/login
Downstream:    POST http://auth-service:PORT/api/v1/login
```

### 4.2 Endpoints Config (`proxy.constants.ts`)

```typescript
export const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
export const AUTH_PREFIX = '/api/v1/auth';
```

## 5. Error Behavior

- **Network Failures (502/504)**: If the downstream service is unreachable or times out, the `HttpProxyService` must return a structured error (e.g., using `neverthrow`'s `err()`). The BFF handler must translate this to a `502 Bad Gateway` or `504 Gateway Timeout`.
- **Downstream Errors (4xx/5xx)**: If the downstream service returns a 400, 401, or 500, the proxy must transparently forward the exact status code and payload back to the client.

## 6. Testing Requirements

- **Unit Tests (`HttpProxyService`)**:
  - Must test successful forwarding.
  - Must test route transformation logic (`stripPrefix`, `addPrefix`).
  - Must test error handling when downstream is unreachable (using `neverthrow`).
- **Module Tests**:
  - Verify `proxy-auth` module correctly registers controllers.
- **Exclusions**:
  - E2E testing for the gateway is explicitly out of scope.
