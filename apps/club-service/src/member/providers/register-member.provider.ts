import { Inject, Injectable } from '@nestjs/common';
import { RegisterMemberUseCase } from '../../domain/use-cases/register-member.use-case';
import type { IMemberRepository } from '../../domain/member/i-member.repository';
import { MEMBER_TOKENS } from '../member.tokens';

@Injectable()
export class RegisterMemberProvider extends RegisterMemberUseCase {
  constructor(
    @Inject(MEMBER_TOKENS.MEMBER_REPOSITORY)
    memberRepository: IMemberRepository,
  ) {
    super(memberRepository);
  }
}
