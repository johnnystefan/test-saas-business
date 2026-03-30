import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ProxyConfig } from './transform.types';

export type ProxyContext = {
  readonly request: FastifyRequest;
  readonly reply: FastifyReply;
  readonly config: ProxyConfig;
  readonly startTime: number;
};

export type ReplyWithFrom = FastifyReply & {
  from: (url: string) => Promise<void>;
};
