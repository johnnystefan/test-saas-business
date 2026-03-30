// Single source of truth for auth-service routing configuration
export const AUTH_SERVICE_URL =
  process.env['AUTH_SERVICE_URL'] ?? 'http://localhost:3001';

// The prefix incoming BFF requests carry for auth routes
export const AUTH_PREFIX = '/api/v1/auth';
