import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RegisterMemberProvider } from './providers/register-member.provider';
import { ListMembersProvider } from './providers/list-members.provider';
import { EnrollMemberProvider } from './providers/enroll-member.provider';
import { UpdateMembershipProvider } from './providers/update-membership.provider';
import { ListMembershipsProvider } from './providers/list-memberships.provider';
import { RegisterMemberDto } from './dto/register-member.dto';
import { EnrollMemberDto } from './dto/enroll-member.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '@saas/auth-utils';
import type { Member } from '../domain/member/member.entity';
import type {
  Membership,
  MembershipWithMember,
} from '../domain/membership/membership.entity';

type AuthenticatedRequest = { user: JwtPayload };

@Controller('members')
@UseGuards(JwtAuthGuard)
export class MemberController {
  constructor(
    private readonly registerProvider: RegisterMemberProvider,
    private readonly listMembersProvider: ListMembersProvider,
    private readonly enrollProvider: EnrollMemberProvider,
    private readonly updateMembershipProvider: UpdateMembershipProvider,
    private readonly listMembershipsProvider: ListMembershipsProvider,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterMemberDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Member> {
    return this.registerProvider.execute({
      ...dto,
      tenantId: req.user.tenantId,
    });
  }

  @Get()
  async list(@Req() req: AuthenticatedRequest): Promise<Member[]> {
    return this.listMembersProvider.execute(req.user.tenantId);
  }

  @Post('enroll')
  @HttpCode(HttpStatus.CREATED)
  async enroll(
    @Body() dto: EnrollMemberDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Membership> {
    return this.enrollProvider.execute({ ...dto, tenantId: req.user.tenantId });
  }

  @Patch('memberships/:id')
  async updateMembership(
    @Param('id') id: string,
    @Body() dto: UpdateMembershipDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Membership> {
    return this.updateMembershipProvider.execute({
      id,
      tenantId: req.user.tenantId,
      status: dto.status,
    });
  }

  @Get('memberships')
  async listMemberships(
    @Query('businessUnitId') businessUnitId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<MembershipWithMember[]> {
    return this.listMembershipsProvider.execute(
      businessUnitId,
      req.user.tenantId,
    );
  }
}
