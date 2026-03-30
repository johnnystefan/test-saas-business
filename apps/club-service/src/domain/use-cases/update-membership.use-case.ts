import { ResourceNotFoundError, type MemberStatus } from '@saas/shared-types';
import type { IMembershipRepository } from '../membership/i-membership.repository';
import type { Membership } from '../membership/membership.entity';

export type UpdateMembershipInput = {
  readonly id: string;
  readonly tenantId: string;
  readonly status: MemberStatus;
};

export class UpdateMembershipUseCase {
  constructor(private readonly repository: IMembershipRepository) {}

  async execute(input: UpdateMembershipInput): Promise<Membership> {
    const membership = await this.repository.updateStatus(
      input.id,
      input.tenantId,
      input.status,
    );
    if (!membership)
      throw new ResourceNotFoundError({ resource: 'Membership', id: input.id });
    return membership;
  }
}
