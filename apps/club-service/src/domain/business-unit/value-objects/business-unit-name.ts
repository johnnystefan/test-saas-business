import { InvalidArgumentError } from '@saas/shared-types';

const MAX_NAME_LENGTH = 100;

export class BusinessUnitName {
  private constructor(readonly value: string) {}

  static create(value: string): BusinessUnitName {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new InvalidArgumentError({
        message: 'BusinessUnitName cannot be empty',
      });
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      throw new InvalidArgumentError({
        message: `BusinessUnitName cannot exceed ${MAX_NAME_LENGTH} characters`,
      });
    }
    return new BusinessUnitName(trimmed);
  }

  toString(): string {
    return this.value;
  }
}
