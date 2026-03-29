import { BaseEntitySchema, TenantedEntitySchema } from './base-entity.schema';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const VALID_ISO = '2026-03-28T00:00:00.000Z';

describe('BaseEntitySchema', () => {
  it('should parse a valid base entity', () => {
    const result = BaseEntitySchema.safeParse({
      id: VALID_UUID,
      createdAt: VALID_ISO,
      updatedAt: VALID_ISO,
    });
    expect(result.success).toBe(true);
  });

  it('should fail when id is missing', () => {
    const result = BaseEntitySchema.safeParse({
      createdAt: VALID_ISO,
      updatedAt: VALID_ISO,
    });
    expect(result.success).toBe(false);
  });

  it('should fail when id is not a valid UUID', () => {
    const result = BaseEntitySchema.safeParse({
      id: 'not-a-uuid',
      createdAt: VALID_ISO,
      updatedAt: VALID_ISO,
    });
    expect(result.success).toBe(false);
  });

  it('should fail when createdAt is not an ISO string', () => {
    const result = BaseEntitySchema.safeParse({
      id: VALID_UUID,
      createdAt: 'March 28 2026',
      updatedAt: VALID_ISO,
    });
    expect(result.success).toBe(false);
  });
});

describe('TenantedEntitySchema', () => {
  it('should parse a valid tenanted entity', () => {
    const result = TenantedEntitySchema.safeParse({
      id: VALID_UUID,
      createdAt: VALID_ISO,
      updatedAt: VALID_ISO,
      tenantId: VALID_UUID,
    });
    expect(result.success).toBe(true);
  });

  it('should fail when tenantId is missing', () => {
    const result = TenantedEntitySchema.safeParse({
      id: VALID_UUID,
      createdAt: VALID_ISO,
      updatedAt: VALID_ISO,
    });
    expect(result.success).toBe(false);
  });

  it('should fail when tenantId is not a valid UUID', () => {
    const result = TenantedEntitySchema.safeParse({
      id: VALID_UUID,
      createdAt: VALID_ISO,
      updatedAt: VALID_ISO,
      tenantId: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when tenantId is an empty string', () => {
    const result = TenantedEntitySchema.safeParse({
      id: VALID_UUID,
      createdAt: VALID_ISO,
      updatedAt: VALID_ISO,
      tenantId: '',
    });
    expect(result.success).toBe(false);
  });
});
