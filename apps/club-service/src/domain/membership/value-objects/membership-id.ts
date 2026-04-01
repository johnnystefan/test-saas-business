import { InvalidArgumentError } from '@saas/shared-types';

export class MembershipId {
  private constructor(readonly value: string) {}

  static create(value: string): MembershipId {
    if (!value || value.trim().length === 0) {
      throw new InvalidArgumentError({
        message: 'MembershipId cannot be empty',
      });
    }
    return new MembershipId(value);
  }

  static generate(): MembershipId {
    return new MembershipId(crypto.randomUUID());
  }

  toString(): string {
    return this.value;
  }
}
