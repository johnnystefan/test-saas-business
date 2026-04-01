import { InvalidArgumentError } from '@saas/shared-types';

export class TenantId {
  private constructor(readonly value: string) {}

  static create(value: string): TenantId {
    if (!value || value.trim().length === 0) {
      throw new InvalidArgumentError({ message: 'TenantId cannot be empty' });
    }
    return new TenantId(value);
  }

  toString(): string {
    return this.value;
  }
}
