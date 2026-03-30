import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import type { FastifyInstance } from 'fastify';
import { AppModule } from './app/app.module';

// Bridges the fastify version mismatch between @nestjs/platform-fastify and
// @fastify/reply-from without resorting to unsafe double casts.
type FastifyPlugin = Parameters<FastifyInstance['register']>[0];

async function bootstrap(): Promise<void> {
  // Step 1: Create raw FastifyAdapter with 10 MB body limit
  const adapter = new FastifyAdapter({ bodyLimit: 10_485_760 });

  // Step 2: Register @fastify/reply-from on raw instance BEFORE NestFactory.create
  // This is CRITICAL — NestJS wraps the adapter after create(); any registration
  // order reversal causes reply.from() to not exist at runtime (silent failure).
  // Dynamic import used to avoid require() syntax.
  const replyFrom = await import('@fastify/reply-from');
  const fastify = adapter.getInstance<FastifyInstance>();
  await fastify.register(replyFrom.default as FastifyPlugin, {
    http: { requestOptions: { timeout: 30_000 } },
  });

  // Step 3: Create NestJS app with the pre-configured adapter
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  // Step 4: Configure app
  app.setGlobalPrefix('api/v1', { exclude: ['health'] });
  app.enableCors({ origin: process.env['CORS_ORIGIN'] ?? '*' });

  // Step 5: Listen
  const port = process.env['PORT'] ?? 3000;
  await app.listen(port, '0.0.0.0');

  Logger.log(
    `API Gateway running on: http://localhost:${port}/api/v1`,
    'Bootstrap',
  );
}

bootstrap();
