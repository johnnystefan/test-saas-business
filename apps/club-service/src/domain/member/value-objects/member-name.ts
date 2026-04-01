import { InvalidArgumentError } from '@saas/shared-types';

const MAX_NAME_LENGTH = 150;

export class MemberName {
  private constructor(readonly value: string) {}

  static create(value: string): MemberName {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new InvalidArgumentError({ message: 'MemberName cannot be empty' });
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      throw new InvalidArgumentError({
        message: `MemberName cannot exceed ${MAX_NAME_LENGTH} characters`,
      });
    }
    return new MemberName(trimmed);
  }

  toString(): string {
    return this.value;
  }
}
