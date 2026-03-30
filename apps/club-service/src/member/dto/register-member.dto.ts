import { z } from 'zod/v4';
import { createZodDto } from 'nestjs-zod';

export const RegisterMemberSchema = z.object({
  name: z.string().min(1),
  email: z.email().optional(),
  phone: z.string().min(1).optional(),
});

export class RegisterMemberDto extends createZodDto(RegisterMemberSchema) {}
