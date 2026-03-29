import { z } from 'zod/v4';

export const USER_ROLE = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TENANT_ADMIN: 'TENANT_ADMIN',
  STAFF: 'STAFF',
  MEMBER: 'MEMBER',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const UserRoleSchema = z.enum(
  Object.values(USER_ROLE) as [UserRole, ...UserRole[]],
);
