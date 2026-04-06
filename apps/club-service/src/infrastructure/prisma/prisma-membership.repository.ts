import { Injectable } from '@nestjs/common';
import { MemberStatusSchema } from '@saas/shared-types';
import type { MemberStatus } from '@saas/shared-types';
import type { IMembershipRepository } from '../../domain/membership/i-membership.repository';
import type {
  CreateMembershipData,
  MembershipWithMember,
} from '../../domain/membership/membership.entity';
import { Membership } from '../../domain/membership/membership.entity';
import { PrismaService } from './prisma.service';

type PrismaMembershipRecord = {
  id: string;
  tenantId: string;
  memberId: string;
  businessUnitId: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type PrismaMembershipWithMember = PrismaMembershipRecord & {
  member: { name: string; email: string | null };
};

@Injectable()
export class PrismaMembershipRepository implements IMembershipRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMembershipData): Promise<Membership> {
    const record = await this.prisma.membership.create({ data });
    return this.toDomain(record);
  }

  async findByMemberAndUnit(
    memberId: string,
    businessUnitId: string,
    tenantId: string,
  ): Promise<Membership | null> {
    const record = await this.prisma.membership.findFirst({
      where: { memberId, businessUnitId, tenantId },
    });
    return record ? this.toDomain(record) : null;
  }

  async findAllByBusinessUnit(
    businessUnitId: string,
    tenantId: string,
  ): Promise<MembershipWithMember[]> {
    const records = await this.prisma.membership.findMany({
      where: { businessUnitId, tenantId },
      include: { member: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toDomainWithMember(r));
  }

  async findAllByMember(
    memberId: string,
    tenantId: string,
  ): Promise<MembershipWithMember[]> {
    const records = await this.prisma.membership.findMany({
      where: { memberId, tenantId },
      include: { member: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toDomainWithMember(r));
  }

  async updateStatus(
    id: string,
    tenantId: string,
    status: MemberStatus,
  ): Promise<Membership | null> {
    const existing = await this.prisma.membership.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return null;
    }

    const record = await this.prisma.membership.update({
      where: { id },
      data: { status },
    });
    return this.toDomain(record);
  }

  private toDomain(record: PrismaMembershipRecord): Membership {
    return Membership.fromPrimitives({
      id: record.id,
      tenantId: record.tenantId,
      memberId: record.memberId,
      businessUnitId: record.businessUnitId,
      status: MemberStatusSchema.parse(record.status),
      startDate: record.startDate,
      endDate: record.endDate,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private toDomainWithMember(
    record: PrismaMembershipWithMember,
  ): MembershipWithMember {
    const p = this.toDomain(record).toPrimitives();
    return {
      ...p,
      memberName: record.member.name,
      memberEmail: record.member.email,
    };
  }
}
