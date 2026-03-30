import { Inject, Injectable } from '@nestjs/common';
import { ListBusinessUnitsUseCase } from '../../domain/use-cases/list-business-units.use-case';
import type { IBusinessUnitRepository } from '../../domain/business-unit/i-business-unit.repository';
import { BUSINESS_UNIT_TOKENS } from '../business-unit.tokens';

@Injectable()
export class ListBusinessUnitsProvider extends ListBusinessUnitsUseCase {
  constructor(
    @Inject(BUSINESS_UNIT_TOKENS.BUSINESS_UNIT_REPOSITORY)
    repository: IBusinessUnitRepository,
  ) {
    super(repository);
  }
}
