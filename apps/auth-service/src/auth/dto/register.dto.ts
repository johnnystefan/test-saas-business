import { z } from 'zod/v4';
import { createZodDto } from 'nestjs-zod';
import { UserRoleSchema } from '@saas/shared-types';

export const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: UserRoleSchema.optional(),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
