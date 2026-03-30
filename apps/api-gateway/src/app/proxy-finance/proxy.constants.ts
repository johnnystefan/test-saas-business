// Single source of truth for finance-service routing configuration
export const FINANCE_SERVICE_URL =
  process.env['FINANCE_SERVICE_URL'] ?? 'http://localhost:3005';

// The prefix incoming BFF requests carry for finance routes
export const FINANCE_PREFIX = '/api/v1/finance';
