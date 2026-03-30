import { Injectable, Logger } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { HttpProxyService } from '@saas/http-proxy';
import type { ProxyResult } from '@saas/http-proxy';
import { AUTH_PREFIX, AUTH_SERVICE_URL } from '../proxy.constants';

@Injectable()
export class AuthProxyService {
  private readonly logger = new Logger(AuthProxyService.name);

  constructor(private readonly httpProxyService: HttpProxyService) {}

  proxyToAuth(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<ProxyResult> {
    this.logger.debug(
      `Proxying to auth-service: ${request.method} ${request.url}`,
    );
    return this.httpProxyService.forwardRequest({
      request,
      reply,
      config: {
        targetUrl: AUTH_SERVICE_URL,
        routeTransform: {
          stripPrefix: AUTH_PREFIX,
          addPrefix: '/api/v1',
        },
      },
      startTime: Date.now(),
    });
  }
}
