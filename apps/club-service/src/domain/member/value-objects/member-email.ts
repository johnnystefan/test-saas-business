import { InvalidArgumentError } from '@saas/shared-types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class MemberEmail {
  private constructor(readonly value: string) {}

  static create(value: string): MemberEmail {
    if (!EMAIL_REGEX.test(value)) {
      throw new InvalidArgumentError({
        message: `Invalid email format: "${value}"`,
      });
    }
    return new MemberEmail(value);
  }

  toString(): string {
    return this.value;
  }
}
