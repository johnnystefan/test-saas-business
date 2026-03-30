import {
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthProxyService } from '../services/auth-proxy.service';

// No class-level guard: register / login / refresh are unauthenticated by design
@Controller('auth')
export class AuthProxyController {
  private readonly logger = new Logger(AuthProxyController.name);

  constructor(private readonly proxyService: AuthProxyService) {}

  @Post('register')
  async register(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    const result = await this.proxyService.proxyToAuth(req, reply);
    if (result.isErr())
      this.handleProxyError('POST /auth/register', result.error, reply);
  }

  @Post('login')
  async login(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    const result = await this.proxyService.proxyToAuth(req, reply);
    if (result.isErr())
      this.handleProxyError('POST /auth/login', result.error, reply);
  }

  @Post('refresh')
  async refresh(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    const result = await this.proxyService.proxyToAuth(req, reply);
    if (result.isErr())
      this.handleProxyError('POST /auth/refresh', result.error, reply);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    const result = await this.proxyService.proxyToAuth(req, reply);
    if (result.isErr())
      this.handleProxyError('POST /auth/logout', result.error, reply);
  }

  private handleProxyError(
    route: string,
    error: { code: string; message: string },
    _reply: FastifyReply,
  ): never {
    this.logger.error(`${route} proxy failed`, { error });
    throw new InternalServerErrorException('Auth service is unavailable');
  }
}
