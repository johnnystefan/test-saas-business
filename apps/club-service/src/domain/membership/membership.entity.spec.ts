import { Membership } from './membership.entity';

describe('Membership entity', () => {
  const validParams = {
    tenantId: 'tenant-1',
    memberId: 'member-1',
    businessUnitId: 'unit-1',
    startDate: new Date('2026-01-01'),
  } as const;

  describe('create()', () => {
    it('should create a membership with a generated UUID and status ACTIVE', () => {
      // Arrange
      const before = new Date();

      // Act
      const membership = Membership.create(validParams);

      // Assert
      const after = new Date();
      expect(membership.id.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
      expect(membership.status.value).toBe('ACTIVE');
      expect(membership.tenantId.value).toBe('tenant-1');
      expect(membership.memberId.value).toBe('member-1');
      expect(membership.businessUnitId.value).toBe('unit-1');
      expect(membership.startDate).toEqual(new Date('2026-01-01'));
      expect(membership.endDate).toBeNull();
      expect(membership.createdAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
      expect(membership.createdAt.getTime()).toBeLessThanOrEqual(
        after.getTime(),
      );
    });

    it('should create different membership instances with different UUIDs', () => {
      // Act
      const first = Membership.create(validParams);
      const second = Membership.create(validParams);

      // Assert
      expect(first.id.value).not.toBe(second.id.value);
    });
  });

  describe('fromPrimitives()', () => {
    it('should reconstruct a Membership from primitives correctly', () => {
      // Arrange
      const primitives = {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        tenantId: 'tenant-1',
        memberId: 'member-1',
        businessUnitId: 'unit-1',
        status: 'ACTIVE' as const,
        startDate: new Date('2026-01-01'),
        endDate: null,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      };

      // Act
      const membership = Membership.fromPrimitives(primitives);

      // Assert
      expect(membership.id.value).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
      expect(membership.tenantId.value).toBe('tenant-1');
      expect(membership.memberId.value).toBe('member-1');
      expect(membership.businessUnitId.value).toBe('unit-1');
      expect(membership.status.value).toBe('ACTIVE');
      expect(membership.startDate).toEqual(new Date('2026-01-01'));
      expect(membership.endDate).toBeNull();
      expect(membership.createdAt).toEqual(new Date('2026-01-01'));
      expect(membership.updatedAt).toEqual(new Date('2026-01-01'));
    });

    it('should reconstruct a Membership with endDate and INACTIVE status from primitives', () => {
      // Arrange
      const primitives = {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        tenantId: 'tenant-1',
        memberId: 'member-1',
        businessUnitId: 'unit-1',
        status: 'INACTIVE' as const,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-06-01'),
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-06-01'),
      };

      // Act
      const membership = Membership.fromPrimitives(primitives);

      // Assert
      expect(membership.status.value).toBe('INACTIVE');
      expect(membership.endDate).toEqual(new Date('2026-06-01'));
    });
  });

  describe('toPrimitives()', () => {
    it('should return a plain object with primitive values', () => {
      // Arrange
      const primitives = {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        tenantId: 'tenant-1',
        memberId: 'member-1',
        businessUnitId: 'unit-1',
        status: 'ACTIVE' as const,
        startDate: new Date('2026-01-01'),
        endDate: null,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      };
      const membership = Membership.fromPrimitives(primitives);

      // Act
      const result = membership.toPrimitives();

      // Assert
      expect(result).toEqual({
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        tenantId: 'tenant-1',
        memberId: 'member-1',
        businessUnitId: 'unit-1',
        status: 'ACTIVE',
        startDate: new Date('2026-01-01'),
        endDate: null,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      });
    });

    it('should return correct primitives when endDate is set and status is SUSPENDED', () => {
      // Arrange
      const primitives = {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        tenantId: 'tenant-1',
        memberId: 'member-1',
        businessUnitId: 'unit-1',
        status: 'SUSPENDED' as const,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-03-01'),
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-03-01'),
      };
      const membership = Membership.fromPrimitives(primitives);

      // Act
      const result = membership.toPrimitives();

      // Assert
      expect(result.status).toBe('SUSPENDED');
      expect(result.endDate).toEqual(new Date('2026-03-01'));
    });
  });
});
