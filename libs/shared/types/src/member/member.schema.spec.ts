import { MemberSchema, MemberStatusSchema } from './member.schema';
import { MEMBER_STATUS } from './member-status.const';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const VALID_ISO = '2026-03-28T00:00:00.000Z';

const baseMember = {
  id: VALID_UUID,
  tenantId: VALID_UUID,
  createdAt: VALID_ISO,
  updatedAt: VALID_ISO,
  name: 'Maria Lopez',
  status: MEMBER_STATUS.ACTIVE,
  enrolledAt: VALID_ISO,
};

describe('MemberSchema', () => {
  it('should parse a complete member with email and phone', () => {
    const result = MemberSchema.safeParse({
      ...baseMember,
      email: 'maria@example.com',
      phone: '+1-555-0100',
    });
    expect(result.success).toBe(true);
  });

  it('should parse a minimal member without email and phone', () => {
    const result = MemberSchema.safeParse(baseMember);
    expect(result.success).toBe(true);
  });

  it('should fail with an invalid status', () => {
    const result = MemberSchema.safeParse({
      ...baseMember,
      status: 'UNKNOWN_STATUS',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when name is missing', () => {
    const withoutName = {
      id: baseMember.id,
      tenantId: baseMember.tenantId,
      createdAt: baseMember.createdAt,
      updatedAt: baseMember.updatedAt,
      status: baseMember.status,
      enrolledAt: baseMember.enrolledAt,
    };
    const result = MemberSchema.safeParse(withoutName);
    expect(result.success).toBe(false);
  });

  it('should fail when enrolledAt is not an ISO string', () => {
    const result = MemberSchema.safeParse({
      ...baseMember,
      enrolledAt: '28/03/2026',
    });
    expect(result.success).toBe(false);
  });
});

describe('MemberStatusSchema', () => {
  it('should accept all valid statuses', () => {
    Object.values(MEMBER_STATUS).forEach((status) => {
      const result = MemberStatusSchema.safeParse(status);
      expect(result.success).toBe(true);
    });
  });
});
