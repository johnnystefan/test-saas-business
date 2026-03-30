import type { BusinessUnit } from '../../../business-unit/business-unit.entity';

export class BusinessUnitMother {
  static active(overrides?: Partial<BusinessUnit>): BusinessUnit {
    return {
      id: 'unit-1',
      tenantId: 'tenant-1',
      name: 'Baseball Academy',
      type: 'BASEBALL_ACADEMY',
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      ...overrides,
    };
  }

  static inactive(overrides?: Partial<BusinessUnit>): BusinessUnit {
    return this.active({ isActive: false, ...overrides });
  }

  static gym(overrides?: Partial<BusinessUnit>): BusinessUnit {
    return this.active({
      id: 'unit-2',
      name: 'The Gym',
      type: 'GYM',
      ...overrides,
    });
  }
}
