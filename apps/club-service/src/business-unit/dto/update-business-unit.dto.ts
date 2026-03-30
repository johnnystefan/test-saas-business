import { z } from 'zod/v4';
import { createZodDto } from 'nestjs-zod';
import { BUSINESS_UNIT_TYPE, type BusinessUnitType } from '@saas/shared-types';

export const UpdateBusinessUnitSchema = z.object({
  name: z.string().min(1).optional(),
  type: z
    .enum(
      Object.values(BUSINESS_UNIT_TYPE) as [
        BusinessUnitType,
        ...BusinessUnitType[],
      ],
    )
    .optional(),
  isActive: z.boolean().optional(),
});

export class UpdateBusinessUnitDto extends createZodDto(
  UpdateBusinessUnitSchema,
) {}
