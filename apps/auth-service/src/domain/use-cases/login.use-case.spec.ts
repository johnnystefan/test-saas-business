import { LoginUseCase } from './login.use-case';
import { AuthenticationFailedError } from '@saas/shared-types';
import type { IUserRepository } from '../user/i-user.repository';
import { UserMother } from './__tests__/mothers/user.mother';
import * as bcrypt from 'bcryptjs';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepository = {
      findByEmail: jest
        .fn()
        .mockResolvedValue(
          UserMother.active({
            passwordHash: bcrypt.hashSync('password123', 10),
          }),
        ),
      findById: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      saveRefreshToken: jest.fn(),
      findRefreshToken: jest.fn(),
      revokeRefreshToken: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    useCase = new LoginUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should return user data when credentials are valid', async () => {
      // Arrange
      const inputData = {
        email: 'test@example.com',
        password: 'password123',
        tenantId: 'tenant-1',
      };

      // Act
      const actualResult = await useCase.execute(inputData);

      // Assert
      expect(actualResult.userId).toBe('user-1');
      expect(actualResult.email).toBe('test@example.com');
      expect(actualResult.role).toBe('MEMBER');
      expect(actualResult.tenantId).toBe('tenant-1');
    });

    it('should throw INVALID_CREDENTIALS when user not found', async () => {
      // Arrange
      const inputData = {
        email: 'test@example.com',
        password: 'password123',
        tenantId: 'tenant-1',
      };
      mockRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(inputData)).rejects.toThrow(
        AuthenticationFailedError,
      );
    });

    it('should throw INVALID_CREDENTIALS when password is wrong', async () => {
      // Arrange
      const inputData = {
        email: 'test@example.com',
        password: 'wrong-password',
        tenantId: 'tenant-1',
      };

      // Act & Assert
      await expect(useCase.execute(inputData)).rejects.toThrow(
        AuthenticationFailedError,
      );
    });

    it('should throw INVALID_CREDENTIALS when user is not active', async () => {
      // Arrange
      const inputData = {
        email: 'test@example.com',
        password: 'password123',
        tenantId: 'tenant-1',
      };
      mockRepository.findByEmail.mockResolvedValue(
        UserMother.inactive({
          passwordHash: bcrypt.hashSync('password123', 10),
        }),
      );

      // Act & Assert
      await expect(useCase.execute(inputData)).rejects.toThrow(
        AuthenticationFailedError,
      );
    });
  });
});
