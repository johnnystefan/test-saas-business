import type { CreateMemberData, Member } from './member.entity';

export interface IMemberRepository {
  create(data: CreateMemberData): Promise<Member>;
  findById(id: string, tenantId: string): Promise<Member | null>;
  findByEmail(email: string, tenantId: string): Promise<Member | null>;
  findAllByTenant(tenantId: string): Promise<Member[]>;
}
