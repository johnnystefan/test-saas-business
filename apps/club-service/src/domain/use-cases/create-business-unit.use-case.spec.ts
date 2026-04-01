import { CreateBusinessUnitUseCase } from './create-business-unit.use-case';
import type { IBusinessUnitRepository } from '../business-unit/i-business-unit.repository';
import { BusinessUnitMother } from './__tests__/mothers/business-unit.mother';

describe('CreateBusinessUnitUseCase', () => {
  let useCase: CreateBusinessUnitUseCase;
  let mockRepository: jest.Mocked<IBusinessUnitRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn().mockResolvedValue(BusinessUnitMother.active()),
      findById: jest.fn().mockResolvedValue(null),
      findAllByTenant: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue(BusinessUnitMother.active()),
    } as jest.Mocked<IBusinessUnitRepository>;

    useCase = new CreateBusinessUnitUseCase(mockRepository);
  });

  it('should create a business unit and return it', async () => {
    // Arrange
    const inputData = {
      tenantId: 'tenant-1',
      name: 'Baseball Academy',
      type: 'BASEBALL_ACADEMY' as const,
    };

    // Act
    const actualResult = await useCase.execute(inputData);

    // Assert
    expect(actualResult).toBeDefined();
    expect(actualResult.name.value).toBe('Baseball Academy');
    expect(mockRepository.create).toHaveBeenCalledWith(inputData);
  });
});
