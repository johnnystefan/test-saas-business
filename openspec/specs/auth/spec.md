# Auth Service Specification

## Purpose

Define el comportamiento del microservicio de autenticación: registro, login, rotación de tokens JWT, logout, y protección de rutas con `JwtAuthGuard`.

---

## Requirements

### Requirement: User Registration

The system MUST allow a new user to register with email, password, name, role, and tenantId. Passwords MUST be hashed before persisting. The system MUST return access and refresh tokens on success.

#### Scenario: Successful registration

- GIVEN a valid `RegisterDto` (email, password, name, role, tenantId)
- WHEN `POST /auth/register` is called
- THEN the system creates the user with a hashed password
- AND returns `{ accessToken, refreshToken, user: { id, email, name, role } }`

#### Scenario: Duplicate email

- GIVEN an email already registered for the same tenant
- WHEN `POST /auth/register` is called with that email
- THEN it MUST fail with a conflict error (409)

#### Scenario: Invalid payload

- GIVEN a `RegisterDto` with missing or invalid fields
- WHEN `POST /auth/register` is called
- THEN it MUST fail with a validation error (400)

---

### Requirement: User Login

The system MUST authenticate a user by email and password. It MUST reject unknown emails or wrong passwords. On success it MUST return new access and refresh tokens.

#### Scenario: Successful login

- GIVEN a registered user's valid credentials (email + password)
- WHEN `POST /auth/login` is called
- THEN the system validates the password hash
- AND returns `{ accessToken, refreshToken, user: { id, email, name, role } }`

#### Scenario: Wrong password

- GIVEN a registered email but an incorrect password
- WHEN `POST /auth/login` is called
- THEN it MUST fail with an unauthorized error (401)

#### Scenario: Unknown email

- GIVEN an email not registered in the system
- WHEN `POST /auth/login` is called
- THEN it MUST fail with an unauthorized error (401)

---

### Requirement: Token Refresh

The system MUST accept a valid refresh token and issue a new access token and a new refresh token (rotation). The old refresh token MUST be invalidated after rotation.

#### Scenario: Successful refresh

- GIVEN a valid, non-expired refresh token stored in the database
- WHEN `POST /auth/refresh` is called with that token
- THEN the system issues a new `accessToken` and a new `refreshToken`
- AND the old refresh token is marked as revoked in the database

#### Scenario: Expired or revoked refresh token

- GIVEN an expired or revoked refresh token
- WHEN `POST /auth/refresh` is called
- THEN it MUST fail with an unauthorized error (401)

---

### Requirement: Logout

The system MUST invalidate the user's refresh token on logout. Subsequent refresh attempts with the revoked token MUST fail.

#### Scenario: Successful logout

- GIVEN a valid refresh token
- WHEN `POST /auth/logout` is called with that token
- THEN the refresh token is marked as revoked in the database
- AND subsequent calls to `POST /auth/refresh` with the same token MUST fail (401)

---

### Requirement: JWT Access Token Guard

The system MUST provide a `JwtAuthGuard` that validates Bearer tokens on protected routes. Routes decorated with `@UseGuards(JwtAuthGuard)` MUST reject requests without a valid, non-expired access token.

#### Scenario: Valid token grants access

- GIVEN a valid, non-expired access token
- WHEN a request with `Authorization: Bearer {token}` hits a guarded route
- THEN the request proceeds and `req.user` is populated with the decoded payload

#### Scenario: Missing or invalid token

- GIVEN no Authorization header or an invalid token
- WHEN a request hits a guarded route
- THEN it MUST fail with an unauthorized error (401)

---

### Requirement: Auth Utils Helpers

The `@saas/auth-utils` library MUST export pure functions for JWT operations: `signAccessToken()`, `signRefreshToken()`, `verifyToken()`, `decodeToken()`. These functions MUST have zero NestJS dependencies.

#### Scenario: Sign and verify round-trip

- GIVEN a valid payload and a secret
- WHEN `signAccessToken(payload, secret, expiresIn)` is called
- THEN a JWT string is returned
- AND `verifyToken(token, secret)` returns the original payload

#### Scenario: Verify expired token

- GIVEN a token with `expiresIn: 0`
- WHEN `verifyToken(token, secret)` is called after expiry
- THEN it MUST throw or return an error indicating token expiry
