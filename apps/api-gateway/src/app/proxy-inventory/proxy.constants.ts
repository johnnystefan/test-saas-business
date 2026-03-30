// Single source of truth for inventory-service routing configuration
export const INVENTORY_SERVICE_URL =
  process.env['INVENTORY_SERVICE_URL'] ?? 'http://localhost:3004';

// The prefix incoming BFF requests carry for inventory routes
export const INVENTORY_PREFIX = '/api/v1/inventory';
