import { z } from 'zod/v4';
import { TenantedEntitySchema } from '../base/base-entity.schema';
import { UserRoleSchema } from './user-role.const';

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const UserStatusSchema = z.enum(
  Object.values(USER_STATUS) as [UserStatus, ...UserStatus[]],
);

export const UserSchema = TenantedEntitySchema.extend({
  email: z.email(),
  name: z.string().min(1),
  role: UserRoleSchema,
  status: UserStatusSchema,
});

export type UserPrimitives = z.infer<typeof UserSchema>;
