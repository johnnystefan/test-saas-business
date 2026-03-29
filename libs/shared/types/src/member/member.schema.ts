import { z } from 'zod/v4';
import { TenantedEntitySchema } from '../base/base-entity.schema';
import { MEMBER_STATUS, MemberStatus } from './member-status.const';

export const MemberStatusSchema = z.enum(
  Object.values(MEMBER_STATUS) as [MemberStatus, ...MemberStatus[]],
);

export const MemberSchema = TenantedEntitySchema.extend({
  name: z.string().min(1),
  status: MemberStatusSchema,
  enrolledAt: z.iso.datetime(),
  email: z.email().optional(),
  phone: z.string().optional(),
});

export type MemberPrimitives = z.infer<typeof MemberSchema>;
