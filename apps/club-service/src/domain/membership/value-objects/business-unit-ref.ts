import { InvalidArgumentError } from '@saas/shared-types';

export class BusinessUnitRef {
  private constructor(readonly value: string) {}

  static create(value: string): BusinessUnitRef {
    if (!value || value.trim().length === 0) {
      throw new InvalidArgumentError({
        message: 'BusinessUnitRef cannot be empty',
      });
    }
    return new BusinessUnitRef(value);
  }

  toString(): string {
    return this.value;
  }
}
