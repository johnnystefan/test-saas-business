import { Module } from '@nestjs/common';
import { BusinessUnitModule } from '../business-unit/business-unit.module';
import { MemberModule } from '../member/member.module';
import { ClubGrpcController } from './club-grpc.controller';

@Module({
  imports: [BusinessUnitModule, MemberModule],
  controllers: [ClubGrpcController],
})
export class ClubGrpcModule {}
