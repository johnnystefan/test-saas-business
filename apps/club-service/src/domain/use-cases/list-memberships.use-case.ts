import type { IMembershipRepository } from '../membership/i-membership.repository';
import type { MembershipWithMember } from '../membership/membership.entity';

export class ListMembershipsUseCase {
  constructor(private readonly repository: IMembershipRepository) {}

  async execute(
    businessUnitId: string,
    tenantId: string,
  ): Promise<MembershipWithMember[]> {
    return this.repository.findAllByBusinessUnit(businessUnitId, tenantId);
  }
}
