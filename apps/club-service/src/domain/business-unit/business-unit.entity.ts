import type { BusinessUnitType } from '@saas/shared-types';

export type BusinessUnit = {
  readonly id: string;
  readonly tenantId: string;
  readonly name: string;
  readonly type: BusinessUnitType;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type CreateBusinessUnitData = {
  readonly tenantId: string;
  readonly name: string;
  readonly type: BusinessUnitType;
};

export type UpdateBusinessUnitData = Partial<
  Pick<BusinessUnit, 'name' | 'type' | 'isActive'>
>;
