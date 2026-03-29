import { z } from 'zod/v4';

export const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type BaseEntity = z.infer<typeof BaseEntitySchema>;

export const TenantedEntitySchema = BaseEntitySchema.extend({
  tenantId: z.string().uuid(),
});

export type TenantedEntity = z.infer<typeof TenantedEntitySchema>;
