import { InvalidArgumentError } from '@saas/shared-types';

const MAX_PHONE_LENGTH = 20;

export class MemberPhone {
  private constructor(readonly value: string) {}

  static create(value: string): MemberPhone {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new InvalidArgumentError({
        message: 'MemberPhone cannot be empty',
      });
    }
    if (trimmed.length > MAX_PHONE_LENGTH) {
      throw new InvalidArgumentError({
        message: `MemberPhone cannot exceed ${MAX_PHONE_LENGTH} characters`,
      });
    }
    return new MemberPhone(trimmed);
  }

  toString(): string {
    return this.value;
  }
}
