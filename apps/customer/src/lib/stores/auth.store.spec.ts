/**
 * auth.store — unit tests
 *
 * Tests Zustand store actions directly (no React rendering needed).
 * The persist middleware writes to localStorage — jsdom provides this.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from './auth.store';

// ── Object Mother ──────────────────────────────────────────────────────────

const AuthUserMother = {
  member: () => ({
    id: 'user-1',
    email: 'member@test.com',
    name: 'Test Member',
    role: 'MEMBER',
    tenantId: 'tenant-1',
  }),
};

// ── Setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  // Reset store to initial state before each test
  useAuthStore.getState().logout();
});

// ── Tests ──────────────────────────────────────────────────────────────────

describe('auth.store', () => {
  describe('login()', () => {
    it('sets user, tokens, and marks isAuthenticated as true', () => {
      // Arrange
      const user = AuthUserMother.member();
      const { login } = useAuthStore.getState();

      // Act
      login({ user, accessToken: 'access-abc', refreshToken: 'refresh-xyz' });

      // Assert
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(user);
      expect(state.accessToken).toBe('access-abc');
      expect(state.refreshToken).toBe('refresh-xyz');
    });

    it('replaces a previous session when called again', () => {
      // Arrange
      const userA = {
        ...AuthUserMother.member(),
        id: 'user-A',
        email: 'a@test.com',
      };
      const userB = {
        ...AuthUserMother.member(),
        id: 'user-B',
        email: 'b@test.com',
      };
      const { login } = useAuthStore.getState();

      // Act
      login({ user: userA, accessToken: 'token-A', refreshToken: 'refresh-A' });
      login({ user: userB, accessToken: 'token-B', refreshToken: 'refresh-B' });

      // Assert
      const state = useAuthStore.getState();
      expect(state.user?.id).toBe('user-B');
      expect(state.accessToken).toBe('token-B');
    });
  });

  describe('logout()', () => {
    it('resets all state to initial values', () => {
      // Arrange — establish an authenticated session first
      useAuthStore.getState().login({
        user: AuthUserMother.member(),
        accessToken: 'access-abc',
        refreshToken: 'refresh-xyz',
      });

      // Act
      useAuthStore.getState().logout();

      // Assert
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
    });

    it('is idempotent when called on an already-logged-out store', () => {
      // Arrange — store is already reset in beforeEach

      // Act
      useAuthStore.getState().logout();

      // Assert — no error thrown, state remains clean
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe('setTokens()', () => {
    it('updates access and refresh tokens without changing the user', () => {
      // Arrange
      const user = AuthUserMother.member();
      useAuthStore.getState().login({
        user,
        accessToken: 'old-access',
        refreshToken: 'old-refresh',
      });

      // Act
      useAuthStore.getState().setTokens({
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
      });

      // Assert
      const state = useAuthStore.getState();
      expect(state.accessToken).toBe('new-access');
      expect(state.refreshToken).toBe('new-refresh');
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
    });

    it('does not alter isAuthenticated flag', () => {
      // Arrange
      useAuthStore.getState().login({
        user: AuthUserMother.member(),
        accessToken: 'old-access',
        refreshToken: 'old-refresh',
      });

      // Act
      useAuthStore.getState().setTokens({
        accessToken: 'rotated-access',
        refreshToken: 'rotated-refresh',
      });

      // Assert
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });
});
