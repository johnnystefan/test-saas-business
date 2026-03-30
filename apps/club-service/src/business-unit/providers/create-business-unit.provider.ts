import { Inject, Injectable } from '@nestjs/common';
import { CreateBusinessUnitUseCase } from '../../domain/use-cases/create-business-unit.use-case';
import type { IBusinessUnitRepository } from '../../domain/business-unit/i-business-unit.repository';
import { BUSINESS_UNIT_TOKENS } from '../business-unit.tokens';

@Injectable()
export class CreateBusinessUnitProvider extends CreateBusinessUnitUseCase {
  constructor(
    @Inject(BUSINESS_UNIT_TOKENS.BUSINESS_UNIT_REPOSITORY)
    repository: IBusinessUnitRepository,
  ) {
    super(repository);
  }
}
