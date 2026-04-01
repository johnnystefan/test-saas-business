import { ResourceNotFoundError } from '@saas/shared-types';
import type { IBusinessUnitRepository } from '../business-unit/i-business-unit.repository';
import type {
  BusinessUnit,
  UpdateBusinessUnitData,
} from '../business-unit/business-unit.entity';

export type UpdateBusinessUnitInput = {
  readonly id: string;
  readonly tenantId: string;
  readonly data: UpdateBusinessUnitData;
};

export class UpdateBusinessUnitUseCase {
  constructor(private readonly repository: IBusinessUnitRepository) {}

  async execute(input: UpdateBusinessUnitInput): Promise<BusinessUnit> {
    const existing = await this.existingBusinessUnit(input.id, input.tenantId);
    return this.updatedBusinessUnit(existing.id, input.tenantId, input.data);
  }

  private async existingBusinessUnit(
    id: string,
    tenantId: string,
  ): Promise<BusinessUnit> {
    const unit = await this.repository.findById(id, tenantId);
    if (!unit)
      throw new ResourceNotFoundError({ resource: 'BusinessUnit', id });
    return unit;
  }

  private async updatedBusinessUnit(
    id: BusinessUnit['id'],
    tenantId: string,
    data: UpdateBusinessUnitData,
  ): Promise<BusinessUnit> {
    return this.repository.update(id.value, tenantId, data);
  }
}
