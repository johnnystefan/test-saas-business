import { InvalidArgumentError, MemberStatusSchema } from '@saas/shared-types';
import type { MemberStatus as MemberStatusType } from '@saas/shared-types';

export class MembershipStatus {
  private constructor(readonly value: MemberStatusType) {}

  static create(value: string): MembershipStatus {
    const parsed = MemberStatusSchema.safeParse(value);
    if (!parsed.success) {
      throw new InvalidArgumentError({
        message: `Invalid MembershipStatus: "${value}"`,
      });
    }
    return new MembershipStatus(parsed.data);
  }

  static active(): MembershipStatus {
    return new MembershipStatus('ACTIVE');
  }

  toString(): string {
    return this.value;
  }
}
