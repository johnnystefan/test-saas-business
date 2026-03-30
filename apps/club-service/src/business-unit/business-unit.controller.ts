import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateBusinessUnitProvider } from './providers/create-business-unit.provider';
import { ListBusinessUnitsProvider } from './providers/list-business-units.provider';
import { UpdateBusinessUnitProvider } from './providers/update-business-unit.provider';
import { CreateBusinessUnitDto } from './dto/create-business-unit.dto';
import { UpdateBusinessUnitDto } from './dto/update-business-unit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '@saas/auth-utils';
import type { BusinessUnit } from '../domain/business-unit/business-unit.entity';

type AuthenticatedRequest = { user: JwtPayload };

@Controller('business-units')
@UseGuards(JwtAuthGuard)
export class BusinessUnitController {
  constructor(
    private readonly createProvider: CreateBusinessUnitProvider,
    private readonly listProvider: ListBusinessUnitsProvider,
    private readonly updateProvider: UpdateBusinessUnitProvider,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateBusinessUnitDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<BusinessUnit> {
    return this.createProvider.execute({ ...dto, tenantId: req.user.tenantId });
  }

  @Get()
  async list(@Req() req: AuthenticatedRequest): Promise<BusinessUnit[]> {
    return this.listProvider.execute(req.user.tenantId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBusinessUnitDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<BusinessUnit> {
    return this.updateProvider.execute({
      id,
      tenantId: req.user.tenantId,
      data: dto,
    });
  }
}
