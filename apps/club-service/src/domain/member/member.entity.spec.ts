import { InvalidArgumentError } from '@saas/shared-types';
import { Member } from './member.entity';

describe('Member entity', () => {
  const validParams = {
    tenantId: 'tenant-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
  } as const;

  describe('create()', () => {
    it('should create a member with a generated UUID, status ACTIVE and enrolledAt ≈ now', () => {
      // Arrange
      const before = new Date();

      // Act
      const member = Member.create(validParams);

      // Assert
      const after = new Date();
      expect(member.id.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
      expect(member.status.value).toBe('ACTIVE');
      expect(member.enrolledAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
      expect(member.enrolledAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(member.name.value).toBe('John Doe');
      expect(member.tenantId.value).toBe('tenant-1');
      expect(member.email?.value).toBe('john@example.com');
      expect(member.phone?.value).toBe('+1234567890');
    });

    it('should create a member without email and phone (nullable)', () => {
      // Arrange
      const params = { tenantId: 'tenant-1', name: 'Jane Doe' };

      // Act
      const member = Member.create(params);

      // Assert
      expect(member.email).toBeNull();
      expect(member.phone).toBeNull();
    });

    it('should throw InvalidArgumentError when name is empty', () => {
      // Arrange
      const params = { ...validParams, name: '' };

      // Act & Assert
      expect(() => Member.create(params)).toThrow(InvalidArgumentError);
    });

    it('should throw InvalidArgumentError when name exceeds 150 characters', () => {
      // Arrange
      const params = { ...validParams, name: 'a'.repeat(151) };

      // Act & Assert
      expect(() => Member.create(params)).toThrow(InvalidArgumentError);
    });

    it('should throw InvalidArgumentError when email is invalid', () => {
      // Arrange
      const params = { ...validParams, email: 'not-an-email' };

      // Act & Assert
      expect(() => Member.create(params)).toThrow(InvalidArgumentError);
    });

    it('should throw InvalidArgumentError when phone exceeds 20 characters', () => {
      // Arrange
      const params = { ...validParams, phone: '1'.repeat(21) };

      // Act & Assert
      expect(() => Member.create(params)).toThrow(InvalidArgumentError);
    });
  });

  describe('fromPrimitives()', () => {
    it('should reconstruct a Member from primitives correctly', () => {
      // Arrange
      const primitives = {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        tenantId: 'tenant-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        status: 'ACTIVE' as const,
        enrolledAt: new Date('2026-01-01'),
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      };

      // Act
      const member = Member.fromPrimitives(primitives);

      // Assert
      expect(member.id.value).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
      expect(member.tenantId.value).toBe('tenant-1');
      expect(member.name.value).toBe('John Doe');
      expect(member.email?.value).toBe('john@example.com');
      expect(member.phone?.value).toBe('+1234567890');
      expect(member.status.value).toBe('ACTIVE');
      expect(member.enrolledAt).toEqual(new Date('2026-01-01'));
      expect(member.createdAt).toEqual(new Date('2026-01-01'));
      expect(member.updatedAt).toEqual(new Date('2026-01-01'));
    });

    it('should reconstruct a Member with null email and phone from primitives', () => {
      // Arrange
      const primitives = {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        tenantId: 'tenant-1',
        name: 'Jane Doe',
        email: null,
        phone: null,
        status: 'INACTIVE' as const,
        enrolledAt: new Date('2026-01-01'),
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      };

      // Act
      const member = Member.fromPrimitives(primitives);

      // Assert
      expect(member.email).toBeNull();
      expect(member.phone).toBeNull();
      expect(member.status.value).toBe('INACTIVE');
    });
  });

  describe('toPrimitives()', () => {
    it('should return a plain object with primitive values', () => {
      // Arrange
      const primitives = {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        tenantId: 'tenant-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        status: 'ACTIVE' as const,
        enrolledAt: new Date('2026-01-01'),
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      };
      const member = Member.fromPrimitives(primitives);

      // Act
      const result = member.toPrimitives();

      // Assert
      expect(result).toEqual({
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        tenantId: 'tenant-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        status: 'ACTIVE',
        enrolledAt: new Date('2026-01-01'),
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      });
    });

    it('should return a plain object with null email and phone when not set', () => {
      // Arrange
      const primitives = {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        tenantId: 'tenant-1',
        name: 'Jane Doe',
        email: null,
        phone: null,
        status: 'SUSPENDED' as const,
        enrolledAt: new Date('2026-01-01'),
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      };
      const member = Member.fromPrimitives(primitives);

      // Act
      const result = member.toPrimitives();

      // Assert
      expect(result.email).toBeNull();
      expect(result.phone).toBeNull();
      expect(result.status).toBe('SUSPENDED');
    });
  });
});
