import { LogoutUseCase } from './logout.use-case';
import type { IUserRepository } from '../user/i-user.repository';
import { RefreshTokenMother } from './__tests__/mothers/refresh-token.mother';

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;
  let mockRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      saveRefreshToken: jest.fn(),
      findRefreshToken: jest
        .fn()
        .mockResolvedValue(RefreshTokenMother.active()),
      revokeRefreshToken: jest.fn().mockResolvedValue(undefined),
    } as jest.Mocked<IUserRepository>;

    useCase = new LogoutUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should revoke the refresh token when it exists and is active', async () => {
      // Arrange
      const inputData = { refreshToken: 'valid-token' };

      // Act
      await useCase.execute(inputData);

      // Assert
      expect(mockRepository.revokeRefreshToken).toHaveBeenCalledWith(
        'valid-token',
      );
    });

    it('should be idempotent when token does not exist', async () => {
      // Arrange
      mockRepository.findRefreshToken.mockResolvedValue(null);
      const inputData = { refreshToken: 'nonexistent-token' };

      // Act
      await useCase.execute(inputData);

      // Assert
      expect(mockRepository.revokeRefreshToken).not.toHaveBeenCalled();
    });

    it('should be idempotent when token is already revoked', async () => {
      // Arrange
      mockRepository.findRefreshToken.mockResolvedValue(
        RefreshTokenMother.revoked(),
      );
      const inputData = { refreshToken: 'already-revoked-token' };

      // Act
      await useCase.execute(inputData);

      // Assert
      expect(mockRepository.revokeRefreshToken).not.toHaveBeenCalled();
    });
  });
});
