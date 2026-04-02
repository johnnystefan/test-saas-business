/**
 * MembershipSchema — unit tests
 *
 * Validates Zod 4 parsing rules: required fields, uuid validation,
 * datetime format, nullable endDate, and enum constraints.
 *
 * Runner: Jest + ts-jest (shared-types project uses Jest, not Vitest).
 */

import { MembershipSchema } from './membership.schema';

// ── Object Mother ──────────────────────────────────────────────────────────

const MembershipMother = {
  valid: () => ({
    id: '550e8400-e29b-41d4-a716-446655440000',
    tenantId: '550e8400-e29b-41d4-a716-446655440001',
    memberId: '550e8400-e29b-41d4-a716-446655440002',
    businessUnitId: '550e8400-e29b-41d4-a716-446655440003',
    status: 'ACTIVE',
    startDate: '2025-01-01T00:00:00.000Z',
    endDate: '2026-01-01T00:00:00.000Z',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  }),
  withNullEndDate: () => ({ ...MembershipMother.valid(), endDate: null }),
  withStatus: (status: string) => ({ ...MembershipMother.valid(), status }),
  withId: (id: string) => ({ ...MembershipMother.valid(), id }),
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('MembershipSchema', () => {
  describe('valid input', () => {
    it('parses a complete valid membership', () => {
      // Arrange
      const input = MembershipMother.valid();

      // Act
      const result = MembershipSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
    });

    it('accepts null endDate (open-ended membership)', () => {
      // Arrange
      const input = MembershipMother.withNullEndDate();

      // Act
      const result = MembershipSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.endDate).toBeNull();
      }
    });

    it('parses ACTIVE status', () => {
      const result = MembershipSchema.safeParse(
        MembershipMother.withStatus('ACTIVE'),
      );
      expect(result.success).toBe(true);
    });

    it('parses EXPIRED status', () => {
      const result = MembershipSchema.safeParse(
        MembershipMother.withStatus('EXPIRED'),
      );
      expect(result.success).toBe(true);
    });

    it('parses CANCELLED status', () => {
      const result = MembershipSchema.safeParse(
        MembershipMother.withStatus('CANCELLED'),
      );
      expect(result.success).toBe(true);
    });

    it('parses PENDING status', () => {
      const result = MembershipSchema.safeParse(
        MembershipMother.withStatus('PENDING'),
      );
      expect(result.success).toBe(true);
    });
  });

  describe('invalid input', () => {
    it('rejects an unknown status value', () => {
      // Arrange
      const input = MembershipMother.withStatus('UNKNOWN');

      // Act
      const result = MembershipSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
    });

    it('rejects a non-UUID id', () => {
      // Arrange
      const input = MembershipMother.withId('not-a-uuid');

      // Act
      const result = MembershipSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
    });

    it('rejects a non-UUID tenantId', () => {
      // Arrange
      const input = { ...MembershipMother.valid(), tenantId: 'bad-tenant' };

      // Act
      const result = MembershipSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
    });

    it('rejects missing required fields', () => {
      // Arrange — omit status
      const { status: _omit, ...input } = MembershipMother.valid();

      // Act
      const result = MembershipSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
    });

    it('rejects non-datetime startDate', () => {
      // Arrange
      const input = { ...MembershipMother.valid(), startDate: '2025-01-01' };

      // Act
      const result = MembershipSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
    });
  });
});
