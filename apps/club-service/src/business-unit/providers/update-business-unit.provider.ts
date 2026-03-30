import { Inject, Injectable } from '@nestjs/common';
import { UpdateBusinessUnitUseCase } from '../../domain/use-cases/update-business-unit.use-case';
import type { IBusinessUnitRepository } from '../../domain/business-unit/i-business-unit.repository';
import { BUSINESS_UNIT_TOKENS } from '../business-unit.tokens';

@Injectable()
export class UpdateBusinessUnitProvider extends UpdateBusinessUnitUseCase {
  constructor(
    @Inject(BUSINESS_UNIT_TOKENS.BUSINESS_UNIT_REPOSITORY)
    repository: IBusinessUnitRepository,
  ) {
    super(repository);
  }
}
