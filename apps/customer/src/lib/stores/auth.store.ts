/**
 * Auth store — persisted authentication state.
 *
 * Stores JWT tokens and user info. Persisted to localStorage via Zustand persist middleware.
 * The API client reads tokens from this store for request authorization.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: string;
  readonly tenantId: string;
}

export interface AuthState {
  readonly user: AuthUser | null;
  readonly accessToken: string | null;
  readonly refreshToken: string | null;
  readonly isAuthenticated: boolean;
}

export interface AuthActions {
  login: (params: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }) => void;
  logout: () => void;
  setTokens: (params: { accessToken: string; refreshToken: string }) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      login: ({ user, accessToken, refreshToken }) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set(initialState);
      },

      setTokens: ({ accessToken, refreshToken }) => {
        set({ accessToken, refreshToken });
      },
    }),
    {
      name: 'stadium-auth', // localStorage key
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
