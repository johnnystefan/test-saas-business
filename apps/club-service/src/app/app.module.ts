import { Module } from '@nestjs/common';
import { ClubAuthModule } from '../auth/auth.module';
import { BusinessUnitModule } from '../business-unit/business-unit.module';
import { MemberModule } from '../member/member.module';
import { ClubGrpcModule } from '../grpc/club-grpc.module';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [
    ClubAuthModule,
    BusinessUnitModule,
    MemberModule,
    ClubGrpcModule,
    HealthModule,
  ],
})
export class AppModule {}
