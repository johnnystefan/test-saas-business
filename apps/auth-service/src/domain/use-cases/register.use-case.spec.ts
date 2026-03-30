import { RegisterUseCase } from './register.use-case';
import { ResourceAlreadyExistsError } from '@saas/shared-types';
import type { IUserRepository } from '../user/i-user.repository';
import { UserMother } from './__tests__/mothers/user.mother';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let mockRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
      findById: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(UserMother.active()),
      saveRefreshToken: jest.fn().mockResolvedValue(undefined),
      findRefreshToken: jest.fn().mockResolvedValue(null),
      revokeRefreshToken: jest.fn().mockResolvedValue(undefined),
    } as jest.Mocked<IUserRepository>;

    useCase = new RegisterUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should register a new user when email is not taken', async () => {
      // Arrange
      const inputData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        tenantId: 'tenant-1',
      };

      // Act
      const actualResult = await useCase.execute(inputData);

      // Assert
      expect(actualResult.user).toBeDefined();
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(
        inputData.email,
        inputData.tenantId,
      );
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: inputData.email,
          name: inputData.name,
          tenantId: inputData.tenantId,
          role: 'MEMBER',
        }),
      );
    });

    it('should hash the password before storing', async () => {
      // Arrange
      const inputData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        tenantId: 'tenant-1',
      };

      // Act
      await useCase.execute(inputData);

      // Assert
      const actualCreateCall = (mockRepository.create as jest.Mock).mock
        .calls[0][0];
      expect(actualCreateCall.passwordHash).not.toBe(inputData.password);
      expect(actualCreateCall.passwordHash).toMatch(/^\$2[ab]\$/);
    });

    it('should throw USER_ALREADY_EXISTS when email is taken', async () => {
      // Arrange
      const inputData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        tenantId: 'tenant-1',
      };
      mockRepository.findByEmail.mockResolvedValue(UserMother.active());

      // Act & Assert
      await expect(useCase.execute(inputData)).rejects.toThrow(
        ResourceAlreadyExistsError,
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should use the provided role when given', async () => {
      // Arrange
      const inputData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        tenantId: 'tenant-1',
        role: 'STAFF' as const,
      };

      // Act
      await useCase.execute(inputData);

      // Assert
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'STAFF' }),
      );
    });
  });
});
