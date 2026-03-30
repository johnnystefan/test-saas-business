// Single source of truth for booking-service routing configuration
export const BOOKING_SERVICE_URL =
  process.env['BOOKING_SERVICE_URL'] ?? 'http://localhost:3003';

// The prefix incoming BFF requests carry for booking routes
export const BOOKING_PREFIX = '/api/v1/booking';
