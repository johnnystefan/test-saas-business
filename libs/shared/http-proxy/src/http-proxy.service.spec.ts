import type { FastifyReply, FastifyRequest } from 'fastify';
import { HttpProxyService } from './http-proxy.service';
import type { ProxyConfig } from './types/transform.types';
import type { ProxyContext } from './types/config.types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildMockRequest(url = '/api/v1/auth/login'): FastifyRequest {
  return { url, method: 'POST' } as unknown as FastifyRequest;
}

function buildMockReply(
  overrides: Partial<{ from: unknown }> = {},
): FastifyReply {
  return {
    statusCode: 200,
    getHeaders: jest
      .fn()
      .mockReturnValue({ 'content-type': 'application/json' }),
    from: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  } as unknown as FastifyReply;
}

function buildContext(
  config: ProxyConfig,
  request?: FastifyRequest,
  reply?: FastifyReply,
): ProxyContext {
  return {
    request: request ?? buildMockRequest(),
    reply: reply ?? buildMockReply(),
    config,
    startTime: Date.now(),
  };
}

// ─── HttpProxyService ────────────────────────────────────────────────────────

describe('HttpProxyService', () => {
  let service: HttpProxyService;

  beforeEach(() => {
    service = new HttpProxyService();
  });

  // ── 3.1: validatedConfig ────────────────────────────────────────────────

  describe('validatedConfig (via forwardRequest)', () => {
    it('returns err(INVALID_CONFIG) when targetUrl is empty', async () => {
      const context = buildContext({ targetUrl: '' });
      const result = await service.forwardRequest(context);

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.code).toBe('INVALID_CONFIG');
      }
    });

    it('returns err(INVALID_CONFIG) when targetUrl is an invalid URL', async () => {
      const context = buildContext({ targetUrl: 'not-a-valid-url' });
      const result = await service.forwardRequest(context);

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.code).toBe('INVALID_CONFIG');
        expect(result.error.message).toContain('Invalid target URL');
      }
    });

    it('proceeds when targetUrl is a valid URL', async () => {
      const context = buildContext({ targetUrl: 'http://localhost:3001' });
      const result = await service.forwardRequest(context);

      // Not an INVALID_CONFIG error — it tried to proxy (ok or PROXY_ERROR)
      if (result.isErr()) {
        expect(result.error.code).not.toBe('INVALID_CONFIG');
      } else {
        expect(result.isOk()).toBe(true);
      }
    });
  });

  // ── 3.2: builtTargetUrl / transformedRoute ─────────────────────────────

  describe('builtTargetUrl / transformedRoute (via forwardRequest)', () => {
    it('strips prefix and adds new prefix correctly', async () => {
      const reply = buildMockReply();
      const context = buildContext(
        {
          targetUrl: 'http://auth-svc:3001',
          routeTransform: { stripPrefix: '/api/v1/auth', addPrefix: '/api/v1' },
        },
        buildMockRequest('/api/v1/auth/login'),
        reply,
      );

      await service.forwardRequest(context);

      const fromMock = (reply as unknown as { from: jest.Mock }).from;
      expect(fromMock).toHaveBeenCalledWith(
        'http://auth-svc:3001/api/v1/login',
      );
    });

    it('uses original path when no routeTransform is provided', async () => {
      const reply = buildMockReply();
      const context = buildContext(
        { targetUrl: 'http://auth-svc:3001' },
        buildMockRequest('/api/v1/login'),
        reply,
      );

      await service.forwardRequest(context);

      const fromMock = (reply as unknown as { from: jest.Mock }).from;
      expect(fromMock).toHaveBeenCalledWith(
        'http://auth-svc:3001/api/v1/login',
      );
    });

    it('handles trailing slash in targetUrl correctly', async () => {
      const reply = buildMockReply();
      const context = buildContext(
        { targetUrl: 'http://auth-svc:3001/' },
        buildMockRequest('/api/v1/login'),
        reply,
      );

      await service.forwardRequest(context);

      const fromMock = (reply as unknown as { from: jest.Mock }).from;
      // Should NOT produce double slash
      expect(fromMock).toHaveBeenCalledWith(
        'http://auth-svc:3001/api/v1/login',
      );
    });

    it('ensures path always starts with /', async () => {
      const reply = buildMockReply();
      const context = buildContext(
        {
          targetUrl: 'http://auth-svc:3001',
          routeTransform: { stripPrefix: '/api/v1', addPrefix: '' },
        },
        buildMockRequest('/api/v1/login'),
        reply,
      );

      await service.forwardRequest(context);

      const fromMock = (reply as unknown as { from: jest.Mock }).from;
      const calledUrl = fromMock.mock.calls[0]?.[0] as string;
      const urlPath = new URL(calledUrl).pathname;
      expect(urlPath.startsWith('/')).toBe(true);
    });
  });

  // ── 3.3: forwarding success and network errors ──────────────────────────

  describe('executedProxy (via forwardRequest)', () => {
    it('calls reply.from() with transformed URL and returns ok(ProxySuccess)', async () => {
      const reply = buildMockReply();
      const context = buildContext(
        {
          targetUrl: 'http://auth-svc:3001',
          routeTransform: { stripPrefix: '/api/v1/auth', addPrefix: '/api/v1' },
        },
        buildMockRequest('/api/v1/auth/login'),
        reply,
      );

      const result = await service.forwardRequest(context);

      const fromMock = (reply as unknown as { from: jest.Mock }).from;
      expect(fromMock).toHaveBeenCalledWith(
        'http://auth-svc:3001/api/v1/login',
      );
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.targetUrl).toBe(
          'http://auth-svc:3001/api/v1/login',
        );
        expect(result.value.statusCode).toBe(200);
      }
    });

    it('returns err(PROXY_ERROR) with cause when reply.from() throws', async () => {
      const networkError = new Error('ECONNREFUSED connect ECONNREFUSED');
      const reply = buildMockReply({
        from: jest.fn().mockRejectedValue(networkError),
      });
      const context = buildContext(
        { targetUrl: 'http://auth-svc:3001' },
        buildMockRequest('/api/v1/login'),
        reply,
      );

      const result = await service.forwardRequest(context);

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.code).toBe('PROXY_ERROR');
        expect(result.error.cause).toBe(networkError);
        expect(result.error.message).toContain('ECONNREFUSED');
      }
    });

    it('returns err(PROXY_ERROR) with "not registered" message when reply has no from()', async () => {
      const replyWithoutFrom = {
        statusCode: 200,
        getHeaders: jest.fn().mockReturnValue({}),
        // No `from` property
      } as unknown as FastifyReply;
      const context = buildContext(
        { targetUrl: 'http://auth-svc:3001' },
        buildMockRequest('/api/v1/login'),
        replyWithoutFrom,
      );

      const result = await service.forwardRequest(context);

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.code).toBe('PROXY_ERROR');
        expect(result.error.message).toContain('not registered');
      }
    });
  });
});
