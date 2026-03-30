import { Module } from '@nestjs/common';
import { BusinessUnitController } from './business-unit.controller';
import { CreateBusinessUnitProvider } from './providers/create-business-unit.provider';
import { ListBusinessUnitsProvider } from './providers/list-business-units.provider';
import { UpdateBusinessUnitProvider } from './providers/update-business-unit.provider';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { PrismaBusinessUnitRepository } from '../infrastructure/prisma/prisma-business-unit.repository';
import { BUSINESS_UNIT_TOKENS } from './business-unit.tokens';

@Module({
  controllers: [BusinessUnitController],
  providers: [
    PrismaService,
    {
      provide: BUSINESS_UNIT_TOKENS.BUSINESS_UNIT_REPOSITORY,
      useClass: PrismaBusinessUnitRepository,
    },
    CreateBusinessUnitProvider,
    ListBusinessUnitsProvider,
    UpdateBusinessUnitProvider,
  ],
  exports: [
    BUSINESS_UNIT_TOKENS.BUSINESS_UNIT_REPOSITORY,
    CreateBusinessUnitProvider,
    ListBusinessUnitsProvider,
    UpdateBusinessUnitProvider,
  ],
})
export class BusinessUnitModule {}
