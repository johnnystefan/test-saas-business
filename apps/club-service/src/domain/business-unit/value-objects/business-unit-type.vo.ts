import {
  BusinessUnitTypeSchema,
  InvalidArgumentError,
} from '@saas/shared-types';
import type { BusinessUnitType as BusinessUnitTypeEnum } from '@saas/shared-types';

export class BusinessUnitTypeVO {
  private constructor(readonly value: BusinessUnitTypeEnum) {}

  static create(value: string): BusinessUnitTypeVO {
    const result = BusinessUnitTypeSchema.safeParse(value);
    if (!result.success) {
      throw new InvalidArgumentError({
        message: `Invalid BusinessUnitType: "${value}"`,
      });
    }
    return new BusinessUnitTypeVO(result.data);
  }

  toString(): string {
    return this.value;
  }
}
