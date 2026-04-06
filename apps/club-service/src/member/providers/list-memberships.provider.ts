import { Inject, Injectable } from '@nestjs/common';
import { ListMembershipsUseCase } from '../../domain/use-cases/list-memberships.use-case';
import type { IMemberRepository } from '../../domain/member/i-member.repository';
import type { IMembershipRepository } from '../../domain/membership/i-membership.repository';
import { MEMBER_TOKENS } from '../member.tokens';

@Injectable()
export class ListMembershipsProvider extends ListMembershipsUseCase {
  constructor(
    @Inject(MEMBER_TOKENS.MEMBER_REPOSITORY)
    memberRepository: IMemberRepository,
    @Inject(MEMBER_TOKENS.MEMBERSHIP_REPOSITORY)
    membershipRepository: IMembershipRepository,
  ) {
    super(memberRepository, membershipRepository);
  }
}
