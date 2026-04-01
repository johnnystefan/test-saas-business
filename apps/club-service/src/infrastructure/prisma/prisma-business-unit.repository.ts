import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@saas/shared-types';
import type { IBusinessUnitRepository } from '../../domain/business-unit/i-business-unit.repository';
import { BusinessUnit } from '../../domain/business-unit/business-unit.entity';
import type {
  CreateBusinessUnitData,
  UpdateBusinessUnitData,
} from '../../domain/business-unit/business-unit.entity';
import { PrismaService } from './prisma.service';

type PrismaBusinessUnit = {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaBusinessUnitRepository implements IBusinessUnitRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBusinessUnitData): Promise<BusinessUnit> {
    const record = await this.prisma.businessUnit.create({ data });
    return this.toDomain(record);
  }

  async findById(id: string, tenantId: string): Promise<BusinessUnit | null> {
    const record = await this.prisma.businessUnit.findFirst({
      where: { id, tenantId },
    });
    return record ? this.toDomain(record) : null;
  }

  async findByNameAndTenant(
    name: string,
    tenantId: string,
  ): Promise<BusinessUnit | null> {
    const record = await this.prisma.businessUnit.findFirst({
      where: { name, tenantId },
    });
    return record ? this.toDomain(record) : null;
  }

  async findAllByTenant(tenantId: string): Promise<BusinessUnit[]> {
    const records = await this.prisma.businessUnit.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  async update(
    id: string,
    tenantId: string,
    data: UpdateBusinessUnitData,
  ): Promise<BusinessUnit> {
    const existing = await this.prisma.businessUnit.findFirst({
      where: { id, tenantId },
    });
    if (!existing) {
      throw new ResourceNotFoundError({ resource: 'BusinessUnit', id });
    }
    const record = await this.prisma.businessUnit.update({
      where: { id },
      data,
    });
    return this.toDomain(record);
  }

  private toDomain(record: PrismaBusinessUnit): BusinessUnit {
    return BusinessUnit.fromPrimitives({
      id: record.id,
      tenantId: record.tenantId,
      name: record.name,
      type: record.type as BusinessUnit['type']['value'],
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
