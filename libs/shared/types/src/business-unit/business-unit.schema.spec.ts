import { BusinessUnitSchema } from './business-unit.schema';
import { BUSINESS_UNIT_TYPE } from './business-unit-type.const';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const VALID_ISO = '2026-03-28T00:00:00.000Z';

const validBusinessUnit = {
  id: VALID_UUID,
  tenantId: VALID_UUID,
  createdAt: VALID_ISO,
  updatedAt: VALID_ISO,
  name: 'Downtown Academy',
  type: BUSINESS_UNIT_TYPE.BASEBALL_ACADEMY,
  isActive: true,
};

describe('BusinessUnitSchema', () => {
  it('should parse a valid business unit', () => {
    const result = BusinessUnitSchema.safeParse(validBusinessUnit);
    expect(result.success).toBe(true);
  });

  it('should fail with an invalid type', () => {
    const result = BusinessUnitSchema.safeParse({
      ...validBusinessUnit,
      type: 'NIGHTCLUB',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when isActive is missing', () => {
    const withoutIsActive = {
      id: validBusinessUnit.id,
      tenantId: validBusinessUnit.tenantId,
      createdAt: validBusinessUnit.createdAt,
      updatedAt: validBusinessUnit.updatedAt,
      name: validBusinessUnit.name,
      type: validBusinessUnit.type,
    };
    const result = BusinessUnitSchema.safeParse(withoutIsActive);
    expect(result.success).toBe(false);
  });

  it('should accept all valid business unit types', () => {
    Object.values(BUSINESS_UNIT_TYPE).forEach((type) => {
      const result = BusinessUnitSchema.safeParse({
        ...validBusinessUnit,
        type,
      });
      expect(result.success).toBe(true);
    });
  });
});
