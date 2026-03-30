import { Injectable } from '@nestjs/common';
import { MemberStatusSchema } from '@saas/shared-types';
import type { IMemberRepository } from '../../domain/member/i-member.repository';
import type {
  CreateMemberData,
  Member,
} from '../../domain/member/member.entity';
import { PrismaService } from './prisma.service';

type PrismaMember = {
  id: string;
  tenantId: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  enrolledAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaMemberRepository implements IMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMemberData): Promise<Member> {
    const record = await this.prisma.member.create({ data });
    return this.toDomain(record);
  }

  async findById(id: string, tenantId: string): Promise<Member | null> {
    const record = await this.prisma.member.findFirst({
      where: { id, tenantId },
    });
    return record ? this.toDomain(record) : null;
  }

  async findByEmail(email: string, tenantId: string): Promise<Member | null> {
    const record = await this.prisma.member.findFirst({
      where: { email, tenantId },
    });
    return record ? this.toDomain(record) : null;
  }

  async findAllByTenant(tenantId: string): Promise<Member[]> {
    const records = await this.prisma.member.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  private toDomain(record: PrismaMember): Member {
    return {
      id: record.id,
      tenantId: record.tenantId,
      name: record.name,
      email: record.email,
      phone: record.phone,
      status: MemberStatusSchema.parse(record.status),
      enrolledAt: record.enrolledAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
