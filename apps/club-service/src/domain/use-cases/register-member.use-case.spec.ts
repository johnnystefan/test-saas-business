import { RegisterMemberUseCase } from './register-member.use-case';
import { ResourceAlreadyExistsError } from '@saas/shared-types';
import type { IMemberRepository } from '../member/i-member.repository';
import { MemberMother } from './__tests__/mothers/member.mother';

describe('RegisterMemberUseCase', () => {
  let useCase: RegisterMemberUseCase;
  let mockRepository: jest.Mocked<IMemberRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn().mockResolvedValue(MemberMother.active()),
      findById: jest.fn().mockResolvedValue(null),
      findByEmail: jest.fn().mockResolvedValue(null),
      findAllByTenant: jest.fn().mockResolvedValue([]),
    } as jest.Mocked<IMemberRepository>;

    useCase = new RegisterMemberUseCase(mockRepository);
  });

  it('should register a member when email is not taken', async () => {
    // Arrange
    const inputData = {
      tenantId: 'tenant-1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    // Act
    const actualResult = await useCase.execute(inputData);

    // Assert
    expect(actualResult).toBeDefined();
    expect(actualResult.name).toBe('John Doe');
    expect(mockRepository.findByEmail).toHaveBeenCalledWith(
      'john@example.com',
      'tenant-1',
    );
    expect(mockRepository.create).toHaveBeenCalledWith(inputData);
  });

  it('should throw MEMBER_EMAIL_ALREADY_EXISTS when email is taken', async () => {
    // Arrange
    mockRepository.findByEmail.mockResolvedValue(MemberMother.active());
    const inputData = {
      tenantId: 'tenant-1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    // Act & Assert
    await expect(useCase.execute(inputData)).rejects.toThrow(
      ResourceAlreadyExistsError,
    );
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should skip email uniqueness check when no email is provided', async () => {
    // Arrange
    const inputData = { tenantId: 'tenant-1', name: 'Jane Doe' };

    // Act
    await useCase.execute(inputData);

    // Assert
    expect(mockRepository.findByEmail).not.toHaveBeenCalled();
    expect(mockRepository.create).toHaveBeenCalled();
  });
});
