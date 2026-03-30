import { z } from 'zod/v4';
import { createZodDto } from 'nestjs-zod';
import { BUSINESS_UNIT_TYPE, type BusinessUnitType } from '@saas/shared-types';

export const CreateBusinessUnitSchema = z.object({
  name: z.string().min(1),
  type: z.enum(
    Object.values(BUSINESS_UNIT_TYPE) as [
      BusinessUnitType,
      ...BusinessUnitType[],
    ],
  ),
});

export class CreateBusinessUnitDto extends createZodDto(
  CreateBusinessUnitSchema,
) {}
