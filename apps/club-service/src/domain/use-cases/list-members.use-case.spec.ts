import { ListMembersUseCase } from './list-members.use-case';
import type { IMemberRepository } from '../member/i-member.repository';
import { MemberMother } from './__tests__/mothers/member.mother';

describe('ListMembersUseCase', () => {
  let useCase: ListMembersUseCase;
  let mockRepository: jest.Mocked<IMemberRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn().mockResolvedValue(MemberMother.active()),
      findById: jest.fn().mockResolvedValue(null),
      findByEmail: jest.fn().mockResolvedValue(null),
      findAllByTenant: jest.fn().mockResolvedValue([MemberMother.active()]),
    } as jest.Mocked<IMemberRepository>;

    useCase = new ListMembersUseCase(mockRepository);
  });

  it('should return all members for a tenant', async () => {
    // Arrange
    const inputTenantId = 'tenant-1';

    // Act
    const actualResult = await useCase.execute(inputTenantId);

    // Assert
    expect(actualResult).toHaveLength(1);
    expect(mockRepository.findAllByTenant).toHaveBeenCalledWith(inputTenantId);
  });

  it('should return empty array when tenant has no members', async () => {
    // Arrange
    mockRepository.findAllByTenant.mockResolvedValue([]);
    const inputTenantId = 'tenant-1';

    // Act
    const actualResult = await useCase.execute(inputTenantId);

    // Assert
    expect(actualResult).toHaveLength(0);
  });
});
