import type { BusinessUnitType } from '@saas/shared-types';
import { BusinessUnitId } from './value-objects/business-unit-id';
import { TenantId } from './value-objects/tenant-id';
import { BusinessUnitName } from './value-objects/business-unit-name';
import { BusinessUnitTypeVO } from './value-objects/business-unit-type.vo';

export interface BusinessUnitPrimitives {
  readonly id: string;
  readonly tenantId: string;
  readonly name: string;
  readonly type: BusinessUnitType;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type CreateBusinessUnitData = {
  readonly tenantId: string;
  readonly name: string;
  readonly type: BusinessUnitType;
  readonly isActive?: boolean;
};

export type UpdateBusinessUnitData = Partial<
  Pick<BusinessUnitPrimitives, 'name' | 'type' | 'isActive'>
>;

export class BusinessUnit {
  private constructor(
    public readonly id: BusinessUnitId,
    public readonly tenantId: TenantId,
    public name: BusinessUnitName,
    public type: BusinessUnitTypeVO,
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(
    params: Omit<
      BusinessUnitPrimitives,
      'id' | 'isActive' | 'createdAt' | 'updatedAt'
    > & {
      readonly isActive?: boolean;
    },
  ): BusinessUnit {
    const now = new Date();
    return new BusinessUnit(
      BusinessUnitId.generate(),
      TenantId.create(params.tenantId),
      BusinessUnitName.create(params.name),
      BusinessUnitTypeVO.create(params.type),
      params.isActive ?? true,
      now,
      now,
    );
  }

  static fromPrimitives(primitives: BusinessUnitPrimitives): BusinessUnit {
    return new BusinessUnit(
      BusinessUnitId.create(primitives.id),
      TenantId.create(primitives.tenantId),
      BusinessUnitName.create(primitives.name),
      BusinessUnitTypeVO.create(primitives.type),
      primitives.isActive,
      primitives.createdAt,
      primitives.updatedAt,
    );
  }

  toPrimitives(): BusinessUnitPrimitives {
    return {
      id: this.id.value,
      tenantId: this.tenantId.value,
      name: this.name.value,
      type: this.type.value,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
