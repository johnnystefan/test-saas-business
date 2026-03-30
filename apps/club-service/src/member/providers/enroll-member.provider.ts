import { Inject, Injectable } from '@nestjs/common';
import { EnrollMemberUseCase } from '../../domain/use-cases/enroll-member.use-case';
import type { IMemberRepository } from '../../domain/member/i-member.repository';
import type { IBusinessUnitRepository } from '../../domain/business-unit/i-business-unit.repository';
import type { IMembershipRepository } from '../../domain/membership/i-membership.repository';
import { MEMBER_TOKENS } from '../member.tokens';

@Injectable()
export class EnrollMemberProvider extends EnrollMemberUseCase {
  constructor(
    @Inject(MEMBER_TOKENS.MEMBER_REPOSITORY)
    memberRepository: IMemberRepository,
    @Inject(MEMBER_TOKENS.BUSINESS_UNIT_REPOSITORY)
    businessUnitRepository: IBusinessUnitRepository,
    @Inject(MEMBER_TOKENS.MEMBERSHIP_REPOSITORY)
    membershipRepository: IMembershipRepository,
  ) {
    super(memberRepository, businessUnitRepository, membershipRepository);
  }
}
