import { UpdateBusinessUnitUseCase } from './update-business-unit.use-case';
import { ResourceNotFoundError } from '@saas/shared-types';
import type { IBusinessUnitRepository } from '../business-unit/i-business-unit.repository';
import { BusinessUnitMother } from './__tests__/mothers/business-unit.mother';

describe('UpdateBusinessUnitUseCase', () => {
  let useCase: UpdateBusinessUnitUseCase;
  let mockRepository: jest.Mocked<IBusinessUnitRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn().mockResolvedValue(BusinessUnitMother.active()),
      findById: jest.fn().mockResolvedValue(BusinessUnitMother.active()),
      findAllByTenant: jest.fn().mockResolvedValue([]),
      update: jest
        .fn()
        .mockResolvedValue(
          BusinessUnitMother.active({ name: 'Updated Academy' }),
        ),
    } as jest.Mocked<IBusinessUnitRepository>;

    useCase = new UpdateBusinessUnitUseCase(mockRepository);
  });

  it('should update a business unit when it exists', async () => {
    // Arrange
    const inputData = {
      id: 'unit-1',
      tenantId: 'tenant-1',
      data: { name: 'Updated Academy' },
    };

    // Act
    const actualResult = await useCase.execute(inputData);

    // Assert
    expect(actualResult.name.value).toBe('Updated Academy');
    expect(mockRepository.findById).toHaveBeenCalledWith('unit-1', 'tenant-1');
    expect(mockRepository.update).toHaveBeenCalledWith(
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      'tenant-1',
      { name: 'Updated Academy' },
    );
  });

  it('should throw BUSINESS_UNIT_NOT_FOUND when unit does not exist', async () => {
    // Arrange
    mockRepository.findById.mockResolvedValue(null);
    const inputData = {
      id: 'unit-999',
      tenantId: 'tenant-1',
      data: { name: 'Updated' },
    };

    // Act & Assert
    await expect(useCase.execute(inputData)).rejects.toThrow(
      ResourceNotFoundError,
    );
    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});
