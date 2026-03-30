import { Module } from '@nestjs/common';
import { ClubAuthModule } from '../auth/auth.module';
import { BusinessUnitModule } from '../business-unit/business-unit.module';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [ClubAuthModule, BusinessUnitModule, MemberModule],
})
export class AppModule {}
