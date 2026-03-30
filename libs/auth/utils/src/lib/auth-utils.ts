import * as jwt from 'jsonwebtoken';
import { z } from 'zod/v4';
import { UserRoleSchema, type UserRole } from '@saas/shared-types';

export type JwtPayload = {
  readonly sub: string;
  readonly email: string;
  readonly role: UserRole;
  readonly tenantId: string;
};

export type TokenPair = {
  readonly accessToken: string;
  readonly refreshToken: string;
};

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

const JwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string(),
  role: UserRoleSchema,
  tenantId: z.string(),
});

export function signAccessToken(payload: JwtPayload, secret: string): string {
  return jwt.sign(payload, secret, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function signRefreshToken(payload: JwtPayload, secret: string): string {
  return jwt.sign(payload, secret, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function verifyToken(token: string, secret: string): JwtPayload {
  const decoded = jwt.verify(token, secret);
  if (typeof decoded === 'string' || !decoded.sub) {
    throw new Error('INVALID_TOKEN');
  }
  return JwtPayloadSchema.parse(decoded);
}

export function decodeToken(token: string): JwtPayload | null {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === 'string') {
    return null;
  }
  const result = JwtPayloadSchema.safeParse(decoded);
  return result.success ? result.data : null;
}

export function getRefreshTokenExpiresAt(): Date {
  return new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
}
