import { z } from 'zod/v4';
import { createZodDto } from 'nestjs-zod';

export const EnrollMemberSchema = z.object({
  memberId: z.string().uuid(),
  businessUnitId: z.string().uuid(),
  startDate: z.coerce.date(),
});

export class EnrollMemberDto extends createZodDto(EnrollMemberSchema) {}
