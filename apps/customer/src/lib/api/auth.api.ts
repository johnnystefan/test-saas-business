/**
 * Auth API — login, refresh, logout.
 *
 * AD-2: All snake_case→camelCase transformation happens here via Zod parsing.
 *       Components and hooks always receive camelCase types.
 */

import { z } from 'zod/v4';
import { publicClient, authClient } from './client';

// ── Raw API response schemas (snake_case) ───────────────────────────────────

const RawUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.string(),
  tenant_id: z.string(),
});

const RawLoginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user: RawUserSchema,
});

const RawRefreshResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

// ── Public output types (camelCase) ─────────────────────────────────────────

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: string;
  readonly tenantId: string;
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: AuthUser;
}

export interface AuthRefreshResult {
  readonly accessToken: string;
  readonly refreshToken: string;
}

// ── Params ───────────────────────────────────────────────────────────────────

export interface LoginParams {
  readonly email: string;
  readonly password: string;
}

export interface RefreshTokensParams {
  readonly refreshToken: string;
}

// ── API functions ────────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Returns camelCase AuthTokens.
 */
export async function login({
  email,
  password,
}: LoginParams): Promise<AuthTokens> {
  const response = await publicClient.post<unknown>('/auth/login', {
    email,
    password,
  });

  const raw = RawLoginResponseSchema.parse(response.data);

  return {
    accessToken: raw.access_token,
    refreshToken: raw.refresh_token,
    user: {
      id: raw.user.id,
      email: raw.user.email,
      name: raw.user.name,
      role: raw.user.role,
      tenantId: raw.user.tenant_id,
    },
  };
}

/**
 * POST /auth/refresh
 * Returns new accessToken + refreshToken (no user payload).
 */
export async function refreshTokens({
  refreshToken,
}: RefreshTokensParams): Promise<AuthRefreshResult> {
  const response = await publicClient.post<unknown>('/auth/refresh', {
    refresh_token: refreshToken,
  });

  const raw = RawRefreshResponseSchema.parse(response.data);

  return {
    accessToken: raw.access_token,
    refreshToken: raw.refresh_token,
  };
}

/**
 * POST /auth/logout
 * Requires a valid Bearer token (uses authClient).
 */
export async function logout(): Promise<void> {
  await authClient.post('/auth/logout');
}
