import type { IMemberRepository } from '../member/i-member.repository';
import type { IMembershipRepository } from '../membership/i-membership.repository';
import type { MembershipWithMember } from '../membership/membership.entity';

export type ListMembershipsInput = {
  readonly email: string;
  readonly tenantId: string;
};

export class ListMembershipsUseCase {
  constructor(
    private readonly memberRepository: IMemberRepository,
    private readonly membershipRepository: IMembershipRepository,
  ) {}

  async execute(input: ListMembershipsInput): Promise<MembershipWithMember[]> {
    const member = await this.memberRepository.findByEmail(
      input.email,
      input.tenantId,
    );
    if (!member) {
      return [];
    }
    const { id: memberId } = member.toPrimitives();
    return this.membershipRepository.findAllByMember(memberId, input.tenantId);
  }
}
