import { InvalidArgumentError } from '@saas/shared-types';

export class BusinessUnitId {
  private constructor(readonly value: string) {}

  static create(value: string): BusinessUnitId {
    if (!value || value.trim().length === 0) {
      throw new InvalidArgumentError({
        message: 'BusinessUnitId cannot be empty',
      });
    }
    return new BusinessUnitId(value);
  }

  static generate(): BusinessUnitId {
    return new BusinessUnitId(crypto.randomUUID());
  }

  toString(): string {
    return this.value;
  }
}
