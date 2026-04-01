import { BusinessUnit } from '../../../business-unit/business-unit.entity';

export class BusinessUnitMother {
  static active(
    overrides?: Partial<Parameters<typeof BusinessUnit.fromPrimitives>[0]>,
  ): BusinessUnit {
    return BusinessUnit.fromPrimitives({
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      tenantId: 'tenant-1-uuid-0000-000000000001',
      name: 'Baseball Academy',
      type: 'BASEBALL_ACADEMY',
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      ...overrides,
    });
  }

  static inactive(
    overrides?: Partial<Parameters<typeof BusinessUnit.fromPrimitives>[0]>,
  ): BusinessUnit {
    return this.active({ isActive: false, ...overrides });
  }

  static gym(
    overrides?: Partial<Parameters<typeof BusinessUnit.fromPrimitives>[0]>,
  ): BusinessUnit {
    return this.active({
      id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      name: 'The Gym',
      type: 'GYM',
      ...overrides,
    });
  }
}
