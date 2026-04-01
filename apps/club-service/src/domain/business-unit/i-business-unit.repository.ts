import type {
  BusinessUnit,
  CreateBusinessUnitData,
  UpdateBusinessUnitData,
} from './business-unit.entity';

export interface IBusinessUnitRepository {
  create(data: CreateBusinessUnitData): Promise<BusinessUnit>;
  findById(id: string, tenantId: string): Promise<BusinessUnit | null>;
  findByNameAndTenant(
    name: string,
    tenantId: string,
  ): Promise<BusinessUnit | null>;
  findAllByTenant(tenantId: string): Promise<BusinessUnit[]>;
  update(
    id: string,
    tenantId: string,
    data: UpdateBusinessUnitData,
  ): Promise<BusinessUnit>;
}
