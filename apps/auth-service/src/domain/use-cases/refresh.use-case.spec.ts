import { RefreshUseCase } from './refresh.use-case';
import { AuthenticationFailedError } from '@saas/shared-types';
import type { IUserRepository } from '../user/i-user.repository';
import { UserMother } from './__tests__/mothers/user.mother';
import { RefreshTokenMother } from './__tests__/mothers/refresh-token.mother';

describe('RefreshUseCase', () => {
  let useCase: RefreshUseCase;
  let mockRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn().mockResolvedValue(UserMother.active()),
      create: jest.fn(),
      saveRefreshToken: jest.fn(),
      findRefreshToken: jest
        .fn()
        .mockResolvedValue(RefreshTokenMother.active()),
      revokeRefreshToken: jest.fn().mockResolvedValue(undefined),
    } as jest.Mocked<IUserRepository>;

    useCase = new RefreshUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should return user data and revoke old token when refresh token is valid', async () => {
      // Arrange
      const inputData = { refreshToken: 'valid-refresh-token' };

      // Act
      const actualResult = await useCase.execute(inputData);

      // Assert
      expect(actualResult.userId).toBe('user-1');
      expect(mockRepository.revokeRefreshToken).toHaveBeenCalledWith(
        'valid-refresh-token',
      );
    });

    it('should throw INVALID_REFRESH_TOKEN when token does not exist', async () => {
      // Arrange
      mockRepository.findRefreshToken.mockResolvedValue(null);
      const inputData = { refreshToken: 'bad-token' };

      // Act & Assert
      await expect(useCase.execute(inputData)).rejects.toThrow(
        AuthenticationFailedError,
      );
    });

    it('should throw REFRESH_TOKEN_REVOKED when token is already revoked', async () => {
      // Arrange
      mockRepository.findRefreshToken.mockResolvedValue(
        RefreshTokenMother.revoked(),
      );
      const inputData = { refreshToken: 'revoked-token' };

      // Act & Assert
      await expect(useCase.execute(inputData)).rejects.toThrow(
        AuthenticationFailedError,
      );
    });

    it('should throw REFRESH_TOKEN_EXPIRED when token is expired', async () => {
      // Arrange
      mockRepository.findRefreshToken.mockResolvedValue(
        RefreshTokenMother.expired(),
      );
      const inputData = { refreshToken: 'expired-token' };

      // Act & Assert
      await expect(useCase.execute(inputData)).rejects.toThrow(
        AuthenticationFailedError,
      );
    });
  });
});
