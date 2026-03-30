import type { IBusinessUnitRepository } from '../business-unit/i-business-unit.repository';
import type { BusinessUnit } from '../business-unit/business-unit.entity';

export class ListBusinessUnitsUseCase {
  constructor(private readonly repository: IBusinessUnitRepository) {}

  async execute(tenantId: string): Promise<BusinessUnit[]> {
    return this.repository.findAllByTenant(tenantId);
  }
}
