import { InvalidArgumentError } from '@saas/shared-types';

export class MemberRef {
  private constructor(readonly value: string) {}

  static create(value: string): MemberRef {
    if (!value || value.trim().length === 0) {
      throw new InvalidArgumentError({ message: 'MemberRef cannot be empty' });
    }
    return new MemberRef(value);
  }

  toString(): string {
    return this.value;
  }
}
