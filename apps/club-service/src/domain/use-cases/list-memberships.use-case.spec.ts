import { ListMembershipsUseCase } from './list-memberships.use-case';
import type { IMembershipRepository } from '../membership/i-membership.repository';
import { MembershipMother } from './__tests__/mothers/membership.mother';

describe('ListMembershipsUseCase', () => {
  let useCase: ListMembershipsUseCase;
  let mockRepository: jest.Mocked<IMembershipRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn().mockResolvedValue(MembershipMother.active()),
      findByMemberAndUnit: jest.fn().mockResolvedValue(null),
      findAllByBusinessUnit: jest
        .fn()
        .mockResolvedValue([MembershipMother.withMember()]),
      updateStatus: jest.fn().mockResolvedValue(MembershipMother.active()),
    } as jest.Mocked<IMembershipRepository>;

    useCase = new ListMembershipsUseCase(mockRepository);
  });

  it('should return memberships with member details for a business unit', async () => {
    // Arrange
    const inputBusinessUnitId = 'unit-1';
    const inputTenantId = 'tenant-1';

    // Act
    const actualResult = await useCase.execute(
      inputBusinessUnitId,
      inputTenantId,
    );

    // Assert
    expect(actualResult).toHaveLength(1);
    expect(actualResult[0].memberName).toBe('John Doe');
    expect(mockRepository.findAllByBusinessUnit).toHaveBeenCalledWith(
      inputBusinessUnitId,
      inputTenantId,
    );
  });

  it('should return empty array when no memberships exist', async () => {
    // Arrange
    mockRepository.findAllByBusinessUnit.mockResolvedValue([]);
    const inputBusinessUnitId = 'unit-1';
    const inputTenantId = 'tenant-1';

    // Act
    const actualResult = await useCase.execute(
      inputBusinessUnitId,
      inputTenantId,
    );

    // Assert
    expect(actualResult).toHaveLength(0);
  });
});
