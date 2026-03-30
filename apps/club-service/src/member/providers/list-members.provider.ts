import { Inject, Injectable } from '@nestjs/common';
import { ListMembersUseCase } from '../../domain/use-cases/list-members.use-case';
import type { IMemberRepository } from '../../domain/member/i-member.repository';
import { MEMBER_TOKENS } from '../member.tokens';

@Injectable()
export class ListMembersProvider extends ListMembersUseCase {
  constructor(
    @Inject(MEMBER_TOKENS.MEMBER_REPOSITORY)
    memberRepository: IMemberRepository,
  ) {
    super(memberRepository);
  }
}
