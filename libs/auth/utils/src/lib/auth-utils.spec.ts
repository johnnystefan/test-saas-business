import {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  decodeToken,
  getRefreshTokenExpiresAt,
} from './auth-utils';

const TEST_SECRET = 'test-secret-key-12345';
const payload = {
  sub: 'user-1',
  email: 'test@example.com',
  role: 'MEMBER' as const,
  tenantId: 'tenant-1',
};

describe('auth-utils', () => {
  describe('signAccessToken', () => {
    it('should return a valid JWT string', () => {
      const token = signAccessToken(payload, TEST_SECRET);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('signRefreshToken', () => {
    it('should return a valid JWT string', () => {
      const token = signRefreshToken(payload, TEST_SECRET);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('verifyToken', () => {
    it('should decode a valid access token and return the payload', () => {
      const token = signAccessToken(payload, TEST_SECRET);
      const decoded = verifyToken(token, TEST_SECRET);
      expect(decoded.sub).toBe(payload.sub);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
      expect(decoded.tenantId).toBe(payload.tenantId);
    });

    it('should throw when secret is wrong', () => {
      const token = signAccessToken(payload, TEST_SECRET);
      expect(() => verifyToken(token, 'wrong-secret')).toThrow();
    });

    it('should throw when token is malformed', () => {
      expect(() => verifyToken('not.a.token', TEST_SECRET)).toThrow();
    });
  });

  describe('decodeToken', () => {
    it('should decode without verifying signature', () => {
      const token = signAccessToken(payload, TEST_SECRET);
      const decoded = decodeToken(token);
      expect(decoded?.sub).toBe(payload.sub);
    });

    it('should return null for invalid token', () => {
      const result = decodeToken('invalid-string');
      expect(result).toBeNull();
    });
  });

  describe('getRefreshTokenExpiresAt', () => {
    it('should return a date ~7 days in the future', () => {
      const now = Date.now();
      const expiresAt = getRefreshTokenExpiresAt();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      expect(expiresAt.getTime()).toBeGreaterThan(now + sevenDaysMs - 1000);
      expect(expiresAt.getTime()).toBeLessThan(now + sevenDaysMs + 1000);
    });
  });
});
