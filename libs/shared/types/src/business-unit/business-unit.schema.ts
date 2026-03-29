import { z } from 'zod/v4';
import { TenantedEntitySchema } from '../base/base-entity.schema';
import {
  BUSINESS_UNIT_TYPE,
  BusinessUnitType,
} from './business-unit-type.const';

export const BusinessUnitTypeSchema = z.enum(
  Object.values(BUSINESS_UNIT_TYPE) as [
    BusinessUnitType,
    ...BusinessUnitType[],
  ],
);

export const BusinessUnitSchema = TenantedEntitySchema.extend({
  name: z.string().min(1),
  type: BusinessUnitTypeSchema,
  isActive: z.boolean(),
});

export type BusinessUnitPrimitives = z.infer<typeof BusinessUnitSchema>;
