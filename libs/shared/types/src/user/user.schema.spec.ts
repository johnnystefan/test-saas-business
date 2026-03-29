import { UserSchema, USER_STATUS } from './user.schema';
import { USER_ROLE } from './user-role.const';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const VALID_ISO = '2026-03-28T00:00:00.000Z';

const validUser = {
  id: VALID_UUID,
  tenantId: VALID_UUID,
  createdAt: VALID_ISO,
  updatedAt: VALID_ISO,
  email: 'john@example.com',
  name: 'John Doe',
  role: USER_ROLE.STAFF,
  status: USER_STATUS.ACTIVE,
};

describe('UserSchema', () => {
  it('should parse a valid user', () => {
    const result = UserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it('should fail with an unknown role', () => {
    const result = UserSchema.safeParse({ ...validUser, role: 'GOD_MODE' });
    expect(result.success).toBe(false);
  });

  it('should fail with an invalid email', () => {
    const result = UserSchema.safeParse({
      ...validUser,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when tenantId is missing', () => {
    const withoutTenantId = {
      id: validUser.id,
      createdAt: validUser.createdAt,
      updatedAt: validUser.updatedAt,
      email: validUser.email,
      name: validUser.name,
      role: validUser.role,
      status: validUser.status,
    };
    const result = UserSchema.safeParse(withoutTenantId);
    expect(result.success).toBe(false);
  });

  it('should infer UserPrimitives type correctly', () => {
    const result = UserSchema.safeParse(validUser);
    if (result.success) {
      // Type-level check: role must be a valid USER_ROLE value
      const role:
        | keyof typeof USER_ROLE
        | (typeof USER_ROLE)[keyof typeof USER_ROLE] = result.data.role;
      expect(Object.values(USER_ROLE)).toContain(role);
    }
  });
});
