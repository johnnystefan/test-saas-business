import {
  ResourceNotFoundError,
  ResourceAlreadyExistsError,
} from '@saas/shared-types';
import type { IMemberRepository } from '../member/i-member.repository';
import type { IBusinessUnitRepository } from '../business-unit/i-business-unit.repository';
import type { IMembershipRepository } from '../membership/i-membership.repository';
import type { Membership } from '../membership/membership.entity';

export type EnrollMemberInput = {
  readonly tenantId: string;
  readonly memberId: string;
  readonly businessUnitId: string;
  readonly startDate: Date;
};

export class EnrollMemberUseCase {
  constructor(
    private readonly memberRepository: IMemberRepository,
    private readonly businessUnitRepository: IBusinessUnitRepository,
    private readonly membershipRepository: IMembershipRepository,
  ) {}

  async execute(input: EnrollMemberInput): Promise<Membership> {
    await this.existingMemberInTenant(input.memberId, input.tenantId);
    await this.existingBusinessUnitInTenant(
      input.businessUnitId,
      input.tenantId,
    );
    await this.ensureNotAlreadyEnrolled(
      input.memberId,
      input.businessUnitId,
      input.tenantId,
    );
    return this.createdMembership(input);
  }

  private async existingMemberInTenant(
    memberId: string,
    tenantId: string,
  ): Promise<void> {
    const member = await this.memberRepository.findById(memberId, tenantId);
    if (!member)
      throw new ResourceNotFoundError({ resource: 'Member', id: memberId });
  }

  private async existingBusinessUnitInTenant(
    businessUnitId: string,
    tenantId: string,
  ): Promise<void> {
    const unit = await this.businessUnitRepository.findById(
      businessUnitId,
      tenantId,
    );
    if (!unit)
      throw new ResourceNotFoundError({
        resource: 'BusinessUnit',
        id: businessUnitId,
      });
  }

  private async ensureNotAlreadyEnrolled(
    memberId: string,
    businessUnitId: string,
    tenantId: string,
  ): Promise<void> {
    const existing = await this.membershipRepository.findByMemberAndUnit(
      memberId,
      businessUnitId,
      tenantId,
    );
    if (existing)
      throw new ResourceAlreadyExistsError({
        resource: 'Membership',
        field: 'memberId+businessUnitId',
        value: `${memberId}+${businessUnitId}`,
      });
  }

  private async createdMembership(
    input: EnrollMemberInput,
  ): Promise<Membership> {
    return this.membershipRepository.create(input);
  }
}
