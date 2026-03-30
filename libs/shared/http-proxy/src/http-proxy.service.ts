import { Injectable, Logger } from '@nestjs/common';
import { err, ok, Result } from 'neverthrow';
import type { ProxyConfig } from './types/transform.types';
import type { RouteTransform } from './types/transform.types';
import type { ProxyContext, ReplyWithFrom } from './types/config.types';
import type {
  ProxyError,
  ProxyResult,
  ProxySuccess,
} from './types/proxy.types';

@Injectable()
export class HttpProxyService {
  private readonly logger = new Logger(HttpProxyService.name);

  async forwardRequest(context: ProxyContext): Promise<ProxyResult> {
    const { request, config } = context;

    const configResult = this.validatedConfig(config);
    if (configResult.isErr()) return err(configResult.error);

    const urlResult = this.builtTargetUrl(request.url, config);
    if (urlResult.isErr()) return err(urlResult.error);

    return this.executedProxy(context, urlResult.value);
  }

  private validatedConfig(config: ProxyConfig): Result<void, ProxyError> {
    if (!config.targetUrl) {
      return err({ code: 'INVALID_CONFIG', message: 'Target URL is required' });
    }
    try {
      new URL(config.targetUrl);
      return ok(void 0);
    } catch {
      return err({
        code: 'INVALID_CONFIG',
        message: 'Invalid target URL',
        targetUrl: config.targetUrl,
      });
    }
  }

  private builtTargetUrl(
    originalPath: string,
    config: ProxyConfig,
  ): Result<string, ProxyError> {
    try {
      const transformed = config.routeTransform
        ? this.transformedRoute(originalPath, config.routeTransform)
        : originalPath;
      const base = config.targetUrl.endsWith('/')
        ? config.targetUrl.slice(0, -1)
        : config.targetUrl;
      const full = `${base}${transformed}`;
      new URL(full);
      return ok(full);
    } catch (error) {
      return err({
        code: 'INVALID_CONFIG',
        message: 'Failed to build target URL',
        originalPath,
        cause: error,
      });
    }
  }

  private transformedRoute(path: string, transform: RouteTransform): string {
    let result = path;
    if (transform.stripPrefix && result.startsWith(transform.stripPrefix)) {
      result = result.slice(transform.stripPrefix.length);
    }
    if (transform.addPrefix) {
      result = transform.addPrefix + result;
    }
    return result.startsWith('/') ? result : `/${result}`;
  }

  private async executedProxy(
    context: ProxyContext,
    targetUrl: string,
  ): Promise<Result<ProxySuccess, ProxyError>> {
    const { request, reply, startTime } = context;
    try {
      const replyWithFrom = reply as ReplyWithFrom;
      if (typeof replyWithFrom.from !== 'function') {
        throw new TypeError(
          '@fastify/reply-from plugin not registered — reply.from is not a function',
        );
      }
      this.logger.debug(
        `Proxying ${request.method} ${request.url} → ${targetUrl}`,
      );
      await replyWithFrom.from(targetUrl);
      return ok({
        statusCode: reply.statusCode,
        headers: reply.getHeaders() as Record<string, string>,
        targetUrl,
        duration: Date.now() - startTime,
      });
    } catch (error) {
      this.logger.error(`Proxy failed: ${(error as Error).message}`, {
        targetUrl,
        originalPath: request.url,
      });
      return err({
        code: 'PROXY_ERROR',
        message: (error as Error).message,
        targetUrl,
        originalPath: request.url,
        cause: error,
      });
    }
  }
}
