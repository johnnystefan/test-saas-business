import type { Result } from 'neverthrow';

export type ProxyError = {
  readonly code: string;
  readonly message: string;
  readonly originalPath?: string;
  readonly targetUrl?: string;
  readonly cause?: unknown;
};

export type ProxySuccess = {
  readonly statusCode: number;
  readonly headers: Record<string, string>;
  readonly targetUrl: string;
  readonly duration: number;
};

export type ProxyResult = Result<ProxySuccess, ProxyError>;
