import { z } from 'zod/v4';
import { createZodDto } from 'nestjs-zod';
import { MEMBER_STATUS, type MemberStatus } from '@saas/shared-types';

export const UpdateMembershipSchema = z.object({
  status: z.enum(
    Object.values(MEMBER_STATUS) as [MemberStatus, ...MemberStatus[]],
  ),
});

export class UpdateMembershipDto extends createZodDto(UpdateMembershipSchema) {}
