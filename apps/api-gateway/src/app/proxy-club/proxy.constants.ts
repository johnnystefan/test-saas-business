// Single source of truth for club-service routing configuration
export const CLUB_SERVICE_URL =
  process.env['CLUB_SERVICE_URL'] ?? 'http://localhost:3002';

// The prefix incoming BFF requests carry for club routes
export const CLUB_PREFIX = '/api/v1/club';
