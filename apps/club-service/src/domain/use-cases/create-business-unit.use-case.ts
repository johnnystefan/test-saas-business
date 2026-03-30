import type { BusinessUnitType } from '@saas/shared-types';
import type { IBusinessUnitRepository } from '../business-unit/i-business-unit.repository';
import type { BusinessUnit } from '../business-unit/business-unit.entity';

export type CreateBusinessUnitInput = {
  readonly tenantId: string;
  readonly name: string;
  readonly type: BusinessUnitType;
};

export class CreateBusinessUnitUseCase {
  constructor(private readonly repository: IBusinessUnitRepository) {}

  async execute(input: CreateBusinessUnitInput): Promise<BusinessUnit> {
    return this.repository.create(input);
  }
}
