import { InvalidArgumentError, MemberStatusSchema } from '@saas/shared-types';
import type { MemberStatus as MemberStatusType } from '@saas/shared-types';

export class MemberStatus {
  private constructor(readonly value: MemberStatusType) {}

  static create(value: string): MemberStatus {
    const parsed = MemberStatusSchema.safeParse(value);
    if (!parsed.success) {
      throw new InvalidArgumentError({
        message: `Invalid MemberStatus: "${value}"`,
      });
    }
    return new MemberStatus(parsed.data);
  }

  static active(): MemberStatus {
    return new MemberStatus('ACTIVE');
  }

  toString(): string {
    return this.value;
  }
}
