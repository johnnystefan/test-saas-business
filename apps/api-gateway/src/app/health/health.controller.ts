import { Controller, Get } from '@nestjs/common';

type HealthResponse = {
  readonly status: 'ok';
  readonly timestamp: string;
  readonly version: string;
};

// GET /health — excluded from globalPrefix ('api/v1')
// Used by Kubernetes liveness probes and load balancers
@Controller('health')
export class HealthController {
  @Get()
  health(): HealthResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env['npm_package_version'] ?? '0.0.0',
    };
  }
}
