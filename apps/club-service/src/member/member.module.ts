import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { PrismaMemberRepository } from '../infrastructure/prisma/prisma-member.repository';
import { PrismaBusinessUnitRepository } from '../infrastructure/prisma/prisma-business-unit.repository';
import { PrismaMembershipRepository } from '../infrastructure/prisma/prisma-membership.repository';
import { MEMBER_TOKENS } from './member.tokens';
import { RegisterMemberProvider } from './providers/register-member.provider';
import { ListMembersProvider } from './providers/list-members.provider';
import { EnrollMemberProvider } from './providers/enroll-member.provider';
import { UpdateMembershipProvider } from './providers/update-membership.provider';
import { ListMembershipsProvider } from './providers/list-memberships.provider';

@Module({
  controllers: [MemberController],
  providers: [
    PrismaService,
    {
      provide: MEMBER_TOKENS.MEMBER_REPOSITORY,
      useClass: PrismaMemberRepository,
    },
    {
      provide: MEMBER_TOKENS.BUSINESS_UNIT_REPOSITORY,
      useClass: PrismaBusinessUnitRepository,
    },
    {
      provide: MEMBER_TOKENS.MEMBERSHIP_REPOSITORY,
      useClass: PrismaMembershipRepository,
    },
    RegisterMemberProvider,
    ListMembersProvider,
    EnrollMemberProvider,
    UpdateMembershipProvider,
    ListMembershipsProvider,
  ],
})
export class MemberModule {}
