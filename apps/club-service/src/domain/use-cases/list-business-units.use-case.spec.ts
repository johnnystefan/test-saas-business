import { ListBusinessUnitsUseCase } from './list-business-units.use-case';
import type { IBusinessUnitRepository } from '../business-unit/i-business-unit.repository';
import { BusinessUnitMother } from './__tests__/mothers/business-unit.mother';

describe('ListBusinessUnitsUseCase', () => {
  let useCase: ListBusinessUnitsUseCase;
  let mockRepository: jest.Mocked<IBusinessUnitRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn().mockResolvedValue(BusinessUnitMother.active()),
      findById: jest.fn().mockResolvedValue(null),
      findAllByTenant: jest
        .fn()
        .mockResolvedValue([BusinessUnitMother.active()]),
      update: jest.fn().mockResolvedValue(BusinessUnitMother.active()),
    } as jest.Mocked<IBusinessUnitRepository>;

    useCase = new ListBusinessUnitsUseCase(mockRepository);
  });

  it('should return all business units for a tenant', async () => {
    // Arrange
    const inputTenantId = 'tenant-1';

    // Act
    const actualResult = await useCase.execute(inputTenantId);

    // Assert
    expect(actualResult).toHaveLength(1);
    expect(mockRepository.findAllByTenant).toHaveBeenCalledWith(inputTenantId);
  });

  it('should return empty array when tenant has no business units', async () => {
    // Arrange
    mockRepository.findAllByTenant.mockResolvedValue([]);
    const inputTenantId = 'tenant-1';

    // Act
    const actualResult = await useCase.execute(inputTenantId);

    // Assert
    expect(actualResult).toHaveLength(0);
  });
});
