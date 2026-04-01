import { InvalidArgumentError } from '@saas/shared-types';
import {
  BusinessUnit,
  type BusinessUnitPrimitives,
} from './business-unit.entity';

describe('BusinessUnit entity', () => {
  const validPrimitives: BusinessUnitPrimitives = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    tenantId: '223e4567-e89b-12d3-a456-426614174001',
    name: 'Baseball Academy',
    type: 'BASEBALL_ACADEMY',
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  describe('BusinessUnit.create()', () => {
    it('should create a BusinessUnit with valid primitives and assign a UUID id', () => {
      // Arrange
      const input = {
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        name: 'Baseball Academy',
        type: 'BASEBALL_ACADEMY' as const,
        isActive: true,
      };

      // Act
      const unit = BusinessUnit.create(input);

      // Assert
      expect(unit).toBeInstanceOf(BusinessUnit);
      expect(unit.toPrimitives().id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
      expect(unit.toPrimitives().name).toBe('Baseball Academy');
      expect(unit.toPrimitives().tenantId).toBe(
        '223e4567-e89b-12d3-a456-426614174001',
      );
      expect(unit.toPrimitives().type).toBe('BASEBALL_ACADEMY');
    });

    it('should throw InvalidArgumentError when name is empty', () => {
      // Arrange
      const input = {
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        name: '',
        type: 'BASEBALL_ACADEMY' as const,
        isActive: true,
      };

      // Act & Assert
      expect(() => BusinessUnit.create(input)).toThrow(InvalidArgumentError);
    });

    it('should throw InvalidArgumentError when name is whitespace only', () => {
      // Arrange
      const input = {
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        name: '   ',
        type: 'BASEBALL_ACADEMY' as const,
        isActive: true,
      };

      // Act & Assert
      expect(() => BusinessUnit.create(input)).toThrow(InvalidArgumentError);
    });

    it('should throw InvalidArgumentError when tenantId is empty', () => {
      // Arrange
      const input = {
        tenantId: '',
        name: 'Valid Name',
        type: 'BASEBALL_ACADEMY' as const,
        isActive: true,
      };

      // Act & Assert
      expect(() => BusinessUnit.create(input)).toThrow(InvalidArgumentError);
    });

    it('should throw InvalidArgumentError when name exceeds 100 characters', () => {
      // Arrange
      const input = {
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        name: 'A'.repeat(101),
        type: 'BASEBALL_ACADEMY' as const,
        isActive: true,
      };

      // Act & Assert
      expect(() => BusinessUnit.create(input)).toThrow(InvalidArgumentError);
    });

    it('should default isActive to true when not provided', () => {
      // Arrange
      const input = {
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        name: 'Baseball Academy',
        type: 'BASEBALL_ACADEMY' as const,
      };

      // Act
      const unit = BusinessUnit.create(input);

      // Assert
      expect(unit.toPrimitives().isActive).toBe(true);
    });

    it('should trim name whitespace on creation', () => {
      // Arrange
      const input = {
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        name: '  Baseball Academy  ',
        type: 'BASEBALL_ACADEMY' as const,
        isActive: true,
      };

      // Act
      const unit = BusinessUnit.create(input);

      // Assert
      expect(unit.toPrimitives().name).toBe('Baseball Academy');
    });

    it('should accept a name of exactly 100 characters', () => {
      // Arrange
      const input = {
        tenantId: '223e4567-e89b-12d3-a456-426614174001',
        name: 'A'.repeat(100),
        type: 'GYM' as const,
        isActive: true,
      };

      // Act
      const unit = BusinessUnit.create(input);

      // Assert
      expect(unit.toPrimitives().name).toHaveLength(100);
    });
  });

  describe('BusinessUnit.fromPrimitives()', () => {
    it('should reconstruct a BusinessUnit from a plain primitives object', () => {
      // Act
      const unit = BusinessUnit.fromPrimitives(validPrimitives);

      // Assert
      expect(unit).toBeInstanceOf(BusinessUnit);
      const primitives = unit.toPrimitives();
      expect(primitives.id).toBe(validPrimitives.id);
      expect(primitives.tenantId).toBe(validPrimitives.tenantId);
      expect(primitives.name).toBe(validPrimitives.name);
      expect(primitives.type).toBe(validPrimitives.type);
      expect(primitives.isActive).toBe(validPrimitives.isActive);
    });

    it('should reconstruct an inactive BusinessUnit from primitives', () => {
      // Arrange
      const inactivePrimitives: BusinessUnitPrimitives = {
        ...validPrimitives,
        isActive: false,
      };

      // Act
      const unit = BusinessUnit.fromPrimitives(inactivePrimitives);

      // Assert
      expect(unit.toPrimitives().isActive).toBe(false);
    });

    it('should reconstruct a GYM type BusinessUnit from primitives', () => {
      // Arrange
      const gymPrimitives: BusinessUnitPrimitives = {
        ...validPrimitives,
        type: 'GYM',
      };

      // Act
      const unit = BusinessUnit.fromPrimitives(gymPrimitives);

      // Assert
      expect(unit.toPrimitives().type).toBe('GYM');
    });
  });

  describe('BusinessUnit.toPrimitives()', () => {
    it('should return a plain object with only primitive types', () => {
      // Act
      const unit = BusinessUnit.fromPrimitives(validPrimitives);
      const primitives = unit.toPrimitives();

      // Assert — all fields match the input exactly
      expect(primitives).toEqual({
        id: validPrimitives.id,
        tenantId: validPrimitives.tenantId,
        name: validPrimitives.name,
        type: validPrimitives.type,
        isActive: validPrimitives.isActive,
        createdAt: validPrimitives.createdAt,
        updatedAt: validPrimitives.updatedAt,
      });
    });

    it('should return a plain object (not a BusinessUnit instance)', () => {
      // Act
      const unit = BusinessUnit.fromPrimitives(validPrimitives);
      const primitives = unit.toPrimitives();

      // Assert
      expect(primitives).not.toBeInstanceOf(BusinessUnit);
      expect(typeof primitives.id).toBe('string');
      expect(typeof primitives.name).toBe('string');
      expect(typeof primitives.tenantId).toBe('string');
      expect(typeof primitives.type).toBe('string');
      expect(typeof primitives.isActive).toBe('boolean');
      expect(primitives.createdAt).toBeInstanceOf(Date);
      expect(primitives.updatedAt).toBeInstanceOf(Date);
    });
  });
});
