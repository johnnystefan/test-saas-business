import { z } from 'zod/v4';
import { BaseEntitySchema } from '../base/base-entity.schema';

export const TenantSchema = BaseEntitySchema.extend({
  name: z.string().min(1),
  slug: z.string().min(1),
  plan: z.string().min(1),
  status: z.string().min(1),
});

export type TenantPrimitives = z.infer<typeof TenantSchema>;
