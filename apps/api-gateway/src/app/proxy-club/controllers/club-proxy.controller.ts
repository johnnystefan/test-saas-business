import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ClubGrpcService } from '../services/club-proxy.service';
import type { JwtPayload } from '@saas/auth-utils';
import type {
  GrpcBusinessUnitResponse,
  GrpcListBusinessUnitsResponse,
  GrpcMemberResponse,
  GrpcMembershipResponse,
  GrpcListMembersResponse,
  GrpcListMembershipsResponse,
} from '@saas/grpc';

interface AuthenticatedRequest {
  readonly user: JwtPayload;
}

interface CreateBusinessUnitBody {
  readonly name: string;
  readonly type: string;
}

interface UpdateBusinessUnitBody {
  readonly name: string;
  readonly is_active: boolean;
}

interface RegisterMemberBody {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
}

interface EnrollMemberBody {
  readonly member_id: string;
  readonly business_unit_id: string;
  readonly start_date: string;
  readonly end_date: string;
}

interface UpdateMembershipBody {
  readonly status: string;
  readonly end_date: string;
}

@Controller('club')
@UseGuards(JwtAuthGuard)
export class ClubProxyController {
  constructor(private readonly clubGrpcService: ClubGrpcService) {}

  @Get('business-units')
  async listBusinessUnits(
    @Req() req: AuthenticatedRequest,
  ): Promise<GrpcListBusinessUnitsResponse> {
    return this.clubGrpcService.listBusinessUnits({
      tenant_id: req.user.tenantId,
    });
  }

  @Post('business-units')
  @HttpCode(HttpStatus.CREATED)
  async createBusinessUnit(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateBusinessUnitBody,
  ): Promise<GrpcBusinessUnitResponse> {
    return this.clubGrpcService.createBusinessUnit({
      tenant_id: req.user.tenantId,
      name: body.name,
      type: body.type,
    });
  }

  @Patch('business-units/:id')
  async updateBusinessUnit(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateBusinessUnitBody,
  ): Promise<GrpcBusinessUnitResponse> {
    return this.clubGrpcService.updateBusinessUnit({
      id,
      tenant_id: req.user.tenantId,
      name: body.name,
      is_active: body.is_active,
    });
  }

  @Get('members')
  async listMembers(
    @Req() req: AuthenticatedRequest,
  ): Promise<GrpcListMembersResponse> {
    return this.clubGrpcService.listMembers({
      tenant_id: req.user.tenantId,
    });
  }

  @Post('members')
  @HttpCode(HttpStatus.CREATED)
  async registerMember(
    @Req() req: AuthenticatedRequest,
    @Body() body: RegisterMemberBody,
  ): Promise<GrpcMemberResponse> {
    return this.clubGrpcService.registerMember({
      tenant_id: req.user.tenantId,
      name: body.name,
      email: body.email,
      phone: body.phone,
    });
  }

  @Post('members/enroll')
  @HttpCode(HttpStatus.CREATED)
  async enrollMember(
    @Req() req: AuthenticatedRequest,
    @Body() body: EnrollMemberBody,
  ): Promise<GrpcMembershipResponse> {
    return this.clubGrpcService.enrollMember({
      tenant_id: req.user.tenantId,
      member_id: body.member_id,
      business_unit_id: body.business_unit_id,
      start_date: body.start_date,
      end_date: body.end_date,
    });
  }

  @Get('members/memberships')
  async listMemberships(
    @Req() req: AuthenticatedRequest,
  ): Promise<GrpcListMembershipsResponse> {
    return this.clubGrpcService.listMemberships({
      tenant_id: req.user.tenantId,
      member_id: req.user.sub,
    });
  }

  @Patch('members/memberships/:id')
  async updateMembership(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateMembershipBody,
  ): Promise<GrpcMembershipResponse> {
    return this.clubGrpcService.updateMembership({
      id,
      tenant_id: req.user.tenantId,
      status: body.status,
      end_date: body.end_date,
    });
  }
}
