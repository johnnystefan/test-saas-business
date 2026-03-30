import { ResourceAlreadyExistsError } from '@saas/shared-types';
import type { IMemberRepository } from '../member/i-member.repository';
import type { Member } from '../member/member.entity';

export type RegisterMemberInput = {
  readonly tenantId: string;
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
};

export class RegisterMemberUseCase {
  constructor(private readonly repository: IMemberRepository) {}

  async execute(input: RegisterMemberInput): Promise<Member> {
    await this.ensureEmailNotTaken(input.email, input.tenantId);
    return this.createdMember(input);
  }

  private async ensureEmailNotTaken(
    email: string | undefined,
    tenantId: string,
  ): Promise<void> {
    if (!email) return;
    const existing = await this.repository.findByEmail(email, tenantId);
    if (existing)
      throw new ResourceAlreadyExistsError({
        resource: 'Member',
        field: 'email',
        value: email,
      });
  }

  private async createdMember(input: RegisterMemberInput): Promise<Member> {
    return this.repository.create({ ...input });
  }
}
