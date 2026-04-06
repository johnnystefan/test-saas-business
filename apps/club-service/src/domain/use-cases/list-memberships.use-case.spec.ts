import { ListMembershipsUseCase } from './list-memberships.use-case';
import type { IMemberRepository } from '../member/i-member.repository';
import type { IMembershipRepository } from '../membership/i-membership.repository';
import { MemberMother } from './__tests__/mothers/member.mother';
import { MembershipMother } from './__tests__/mothers/membership.mother';

describe('ListMembershipsUseCase', () => {
  let useCase: ListMembershipsUseCase;
  let mockMemberRepository: jest.Mocked<IMemberRepository>;
  let mockMembershipRepository: jest.Mocked<IMembershipRepository>;

  beforeEach(() => {
    mockMemberRepository = {
      create: jest.fn().mockResolvedValue(MemberMother.active()),
      findById: jest.fn().mockResolvedValue(null),
      findByEmail: jest.fn().mockResolvedValue(MemberMother.active()),
      findAllByTenant: jest.fn().mockResolvedValue([]),
    } as jest.Mocked<IMemberRepository>;

    mockMembershipRepository = {
      create: jest.fn().mockResolvedValue(MembershipMother.active()),
      findByMemberAndUnit: jest.fn().mockResolvedValue(null),
      findAllByBusinessUnit: jest.fn().mockResolvedValue([]),
      findAllByMember: jest
        .fn()
        .mockResolvedValue([MembershipMother.withMember()]),
      updateStatus: jest.fn().mockResolvedValue(MembershipMother.active()),
    } as jest.Mocked<IMembershipRepository>;

    useCase = new ListMembershipsUseCase(
      mockMemberRepository,
      mockMembershipRepository,
    );
  });

  it('should resolve member by email and return their memberships', async () => {
    // Arrange
    const input = { email: 'john@example.com', tenantId: 'tenant-1' };
    const member = MemberMother.active();
    mockMemberRepository.findByEmail.mockResolvedValue(member);

    // Act
    const actualResult = await useCase.execute(input);

    // Assert
    expect(actualResult).toHaveLength(1);
    expect(actualResult[0].memberName).toBe('John Doe');
    expect(mockMemberRepository.findByEmail).toHaveBeenCalledWith(
      'john@example.com',
      'tenant-1',
    );
    const { id: expectedMemberId } = member.toPrimitives();
    expect(mockMembershipRepository.findAllByMember).toHaveBeenCalledWith(
      expectedMemberId,
      'tenant-1',
    );
  });

  it('should return empty array when member is not found', async () => {
    // Arrange
    mockMemberRepository.findByEmail.mockResolvedValue(null);
    const input = { email: 'unknown@example.com', tenantId: 'tenant-1' };

    // Act
    const actualResult = await useCase.execute(input);

    // Assert
    expect(actualResult).toHaveLength(0);
    expect(mockMembershipRepository.findAllByMember).not.toHaveBeenCalled();
  });

  it('should return empty array when member has no memberships', async () => {
    // Arrange
    mockMembershipRepository.findAllByMember.mockResolvedValue([]);
    const input = { email: 'john@example.com', tenantId: 'tenant-1' };

    // Act
    const actualResult = await useCase.execute(input);

    // Assert
    expect(actualResult).toHaveLength(0);
  });
});
