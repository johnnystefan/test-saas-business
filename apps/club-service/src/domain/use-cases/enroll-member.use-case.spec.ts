import { EnrollMemberUseCase } from './enroll-member.use-case';
import {
  ResourceNotFoundError,
  ResourceAlreadyExistsError,
} from '@saas/shared-types';
import type { IMemberRepository } from '../member/i-member.repository';
import type { IBusinessUnitRepository } from '../business-unit/i-business-unit.repository';
import type { IMembershipRepository } from '../membership/i-membership.repository';
import { MemberMother } from './__tests__/mothers/member.mother';
import { BusinessUnitMother } from './__tests__/mothers/business-unit.mother';
import { MembershipMother } from './__tests__/mothers/membership.mother';

describe('EnrollMemberUseCase', () => {
  let useCase: EnrollMemberUseCase;
  let mockMemberRepository: jest.Mocked<IMemberRepository>;
  let mockBusinessUnitRepository: jest.Mocked<IBusinessUnitRepository>;
  let mockMembershipRepository: jest.Mocked<IMembershipRepository>;

  beforeEach(() => {
    mockMemberRepository = {
      create: jest.fn().mockResolvedValue(MemberMother.active()),
      findById: jest.fn().mockResolvedValue(MemberMother.active()),
      findByEmail: jest.fn().mockResolvedValue(null),
      findAllByTenant: jest.fn().mockResolvedValue([]),
    } as jest.Mocked<IMemberRepository>;

    mockBusinessUnitRepository = {
      create: jest.fn().mockResolvedValue(BusinessUnitMother.active()),
      findById: jest.fn().mockResolvedValue(BusinessUnitMother.active()),
      findByNameAndTenant: jest.fn().mockResolvedValue(null),
      findAllByTenant: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue(BusinessUnitMother.active()),
    } as jest.Mocked<IBusinessUnitRepository>;

    mockMembershipRepository = {
      create: jest.fn().mockResolvedValue(MembershipMother.active()),
      findByMemberAndUnit: jest.fn().mockResolvedValue(null),
      findAllByBusinessUnit: jest.fn().mockResolvedValue([]),
      findAllByMember: jest.fn().mockResolvedValue([]),
      updateStatus: jest.fn().mockResolvedValue(MembershipMother.active()),
    } as jest.Mocked<IMembershipRepository>;

    useCase = new EnrollMemberUseCase(
      mockMemberRepository,
      mockBusinessUnitRepository,
      mockMembershipRepository,
    );
  });

  it('should enroll a member in a business unit', async () => {
    // Arrange
    const inputData = {
      tenantId: 'tenant-1',
      memberId: 'member-1',
      businessUnitId: 'unit-1',
      startDate: new Date('2026-01-01'),
    };

    // Act
    const actualResult = await useCase.execute(inputData);

    // Assert
    expect(actualResult).toBeDefined();
    expect(actualResult.memberId.value).toBe(
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    );
    expect(actualResult.businessUnitId.value).toBe(
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    );
    expect(mockMemberRepository.findById).toHaveBeenCalledWith(
      'member-1',
      'tenant-1',
    );
    expect(mockBusinessUnitRepository.findById).toHaveBeenCalledWith(
      'unit-1',
      'tenant-1',
    );
    expect(mockMembershipRepository.findByMemberAndUnit).toHaveBeenCalledWith(
      'member-1',
      'unit-1',
      'tenant-1',
    );
    expect(mockMembershipRepository.create).toHaveBeenCalledWith(inputData);
  });

  it('should throw MEMBER_NOT_FOUND when member does not exist', async () => {
    // Arrange
    mockMemberRepository.findById.mockResolvedValue(null);
    const inputData = {
      tenantId: 'tenant-1',
      memberId: 'member-1',
      businessUnitId: 'unit-1',
      startDate: new Date('2026-01-01'),
    };

    // Act & Assert
    await expect(useCase.execute(inputData)).rejects.toThrow(
      ResourceNotFoundError,
    );
    expect(mockMembershipRepository.create).not.toHaveBeenCalled();
  });

  it('should throw BUSINESS_UNIT_NOT_FOUND when unit does not exist', async () => {
    // Arrange
    mockBusinessUnitRepository.findById.mockResolvedValue(null);
    const inputData = {
      tenantId: 'tenant-1',
      memberId: 'member-1',
      businessUnitId: 'unit-1',
      startDate: new Date('2026-01-01'),
    };

    // Act & Assert
    await expect(useCase.execute(inputData)).rejects.toThrow(
      ResourceNotFoundError,
    );
    expect(mockMembershipRepository.create).not.toHaveBeenCalled();
  });

  it('should throw MEMBER_ALREADY_ENROLLED when already enrolled', async () => {
    // Arrange
    mockMembershipRepository.findByMemberAndUnit.mockResolvedValue(
      MembershipMother.active(),
    );
    const inputData = {
      tenantId: 'tenant-1',
      memberId: 'member-1',
      businessUnitId: 'unit-1',
      startDate: new Date('2026-01-01'),
    };

    // Act & Assert
    await expect(useCase.execute(inputData)).rejects.toThrow(
      ResourceAlreadyExistsError,
    );
    expect(mockMembershipRepository.create).not.toHaveBeenCalled();
  });
});
