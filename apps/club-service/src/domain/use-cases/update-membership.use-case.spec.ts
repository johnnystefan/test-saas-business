import { UpdateMembershipUseCase } from './update-membership.use-case';
import type { IMembershipRepository } from '../membership/i-membership.repository';
import { ResourceNotFoundError } from '@saas/shared-types';
import { MembershipMother } from './__tests__/mothers/membership.mother';

describe('UpdateMembershipUseCase', () => {
  let useCase: UpdateMembershipUseCase;
  let mockRepository: jest.Mocked<IMembershipRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn().mockResolvedValue(MembershipMother.active()),
      findByMemberAndUnit: jest.fn().mockResolvedValue(null),
      findAllByBusinessUnit: jest.fn().mockResolvedValue([]),
      updateStatus: jest.fn().mockResolvedValue(MembershipMother.suspended()),
    } as jest.Mocked<IMembershipRepository>;

    useCase = new UpdateMembershipUseCase(mockRepository);
  });

  it('should update membership status', async () => {
    // Arrange
    const inputData = {
      id: 'membership-1',
      tenantId: 'tenant-1',
      status: 'SUSPENDED' as const,
    };

    // Act
    const actualResult = await useCase.execute(inputData);

    // Assert
    expect(actualResult.status).toBe('SUSPENDED');
    expect(mockRepository.updateStatus).toHaveBeenCalledWith(
      'membership-1',
      'tenant-1',
      'SUSPENDED',
    );
  });

  it('should throw ResourceNotFoundError when membership does not exist', async () => {
    // Arrange
    mockRepository.updateStatus.mockResolvedValue(null);
    const inputData = {
      id: 'non-existent-id',
      tenantId: 'tenant-1',
      status: 'SUSPENDED' as const,
    };

    // Act & Assert
    await expect(useCase.execute(inputData)).rejects.toThrow(
      ResourceNotFoundError,
    );
    expect(mockRepository.updateStatus).toHaveBeenCalledWith(
      'non-existent-id',
      'tenant-1',
      'SUSPENDED',
    );
  });
});
