import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { RegisterProvider } from './providers/register.provider';
import { LoginProvider } from './providers/login.provider';
import { RefreshProvider } from './providers/refresh.provider';
import { LogoutProvider } from './providers/logout.provider';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { TokenPair } from '@saas/auth-utils';

type RegisterResponse = { user: { id: string; email: string; name: string } };

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerProvider: RegisterProvider,
    private readonly loginProvider: LoginProvider,
    private readonly refreshProvider: RefreshProvider,
    private readonly logoutProvider: LogoutProvider,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Headers('x-tenant-id') tenantId: string,
  ): Promise<RegisterResponse> {
    if (!tenantId)
      throw new BadRequestException('x-tenant-id header is required');
    return this.registerProvider.handle({ ...dto, tenantId });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Headers('x-tenant-id') tenantId: string,
  ): Promise<TokenPair> {
    if (!tenantId)
      throw new BadRequestException('x-tenant-id header is required');
    return this.loginProvider.handle({ ...dto, tenantId });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto): Promise<TokenPair> {
    return this.refreshProvider.handle(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() dto: RefreshDto): Promise<void> {
    await this.logoutProvider.handle(dto);
  }
}
