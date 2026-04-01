import { InvalidArgumentError } from '@saas/shared-types';

export class MemberId {
  private constructor(readonly value: string) {}

  static create(value: string): MemberId {
    if (!value || value.trim().length === 0) {
      throw new InvalidArgumentError({ message: 'MemberId cannot be empty' });
    }
    return new MemberId(value);
  }

  static generate(): MemberId {
    return new MemberId(crypto.randomUUID());
  }

  toString(): string {
    return this.value;
  }
}
