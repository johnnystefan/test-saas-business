import { Inject, Injectable } from '@nestjs/common';
import { UpdateMembershipUseCase } from '../../domain/use-cases/update-membership.use-case';
import type { IMembershipRepository } from '../../domain/membership/i-membership.repository';
import { MEMBER_TOKENS } from '../member.tokens';

@Injectable()
export class UpdateMembershipProvider extends UpdateMembershipUseCase {
  constructor(
    @Inject(MEMBER_TOKENS.MEMBERSHIP_REPOSITORY)
    membershipRepository: IMembershipRepository,
  ) {
    super(membershipRepository);
  }
}
