import { TenantSchema } from './tenant.schema';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const VALID_ISO = '2026-03-28T00:00:00.000Z';

const validTenant = {
  id: VALID_UUID,
  createdAt: VALID_ISO,
  updatedAt: VALID_ISO,
  name: 'Diamondbacks Academy',
  slug: 'diamondbacks-academy',
  plan: 'professional',
  status: 'active',
};

describe('TenantSchema', () => {
  it('should parse a valid tenant', () => {
    const result = TenantSchema.safeParse(validTenant);
    expect(result.success).toBe(true);
  });

  it('should fail when name is missing', () => {
    const withoutName = {
      id: validTenant.id,
      createdAt: validTenant.createdAt,
      updatedAt: validTenant.updatedAt,
      slug: validTenant.slug,
      plan: validTenant.plan,
      status: validTenant.status,
    };
    const result = TenantSchema.safeParse(withoutName);
    expect(result.success).toBe(false);
  });

  it('should fail when slug is missing', () => {
    const withoutSlug = {
      id: validTenant.id,
      createdAt: validTenant.createdAt,
      updatedAt: validTenant.updatedAt,
      name: validTenant.name,
      plan: validTenant.plan,
      status: validTenant.status,
    };
    const result = TenantSchema.safeParse(withoutSlug);
    expect(result.success).toBe(false);
  });

  it('should fail when id is not a UUID', () => {
    const result = TenantSchema.safeParse({ ...validTenant, id: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });

  it('should fail when createdAt is not an ISO date', () => {
    const result = TenantSchema.safeParse({
      ...validTenant,
      createdAt: 'yesterday',
    });
    expect(result.success).toBe(false);
  });
});
