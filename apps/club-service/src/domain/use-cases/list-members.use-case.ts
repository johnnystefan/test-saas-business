import type { IMemberRepository } from '../member/i-member.repository';
import type { Member } from '../member/member.entity';

export class ListMembersUseCase {
  constructor(private readonly repository: IMemberRepository) {}

  async execute(tenantId: string): Promise<Member[]> {
    return this.repository.findAllByTenant(tenantId);
  }
}
