import { z } from 'zod/v4';
import { MembershipStatus } from './membership-status.const';

export const MembershipStatusSchema = z.enum(
  Object.values(MembershipStatus) as [MembershipStatus, ...MembershipStatus[]],
);

export const MembershipSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  memberId: z.string().uuid(),
  businessUnitId: z.string().uuid(),
  status: MembershipStatusSchema,
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Membership = z.infer<typeof MembershipSchema>;
