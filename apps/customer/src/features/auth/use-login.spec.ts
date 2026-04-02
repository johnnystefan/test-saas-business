/**
 * use-login — unit tests
 *
 * Scenario 1: User logs in successfully
 * GIVEN the app is configured with a valid VITE_TENANT_ID
 * WHEN the user submits valid credentials
 * THEN storeLogin is called with the returned tokens
 * AND navigate('/') is called
 * AND when login fails, the error state is set
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { createElement, type ReactNode } from 'react';
import { useAuthStore } from '../../lib/stores/auth.store';

// ── Module mocks ────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../lib/api/auth.api', () => ({
  login: vi.fn(),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, null, children),
    );
  };
}

// ── Object Mothers ───────────────────────────────────────────────────────────

const AuthTokensMother = {
  valid: () => ({
    accessToken: 'access-token-abc',
    refreshToken: 'refresh-token-xyz',
    user: {
      id: 'user-1',
      email: 'player@test.com',
      name: 'Juan Pérez',
      role: 'MEMBER',
      tenantId: 'tenant-1',
    },
  }),
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().logout();
  });

  it('calls storeLogin with returned tokens when login succeeds', async () => {
    // Arrange
    const { login: mockLogin } = await import('../../lib/api/auth.api');
    vi.mocked(mockLogin).mockResolvedValueOnce(AuthTokensMother.valid());

    const { useLogin } = await import('./use-login');
    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper() });

    // Act
    result.current.login({ email: 'player@test.com', password: 'secret123' });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Assert — store has been populated with the returned tokens
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.accessToken).toBe('access-token-abc');
    expect(state.refreshToken).toBe('refresh-token-xyz');
    expect(state.user?.name).toBe('Juan Pérez');
  });

  it('calls navigate("/") after a successful login', async () => {
    // Arrange
    const { login: mockLogin } = await import('../../lib/api/auth.api');
    vi.mocked(mockLogin).mockResolvedValueOnce(AuthTokensMother.valid());

    const { useLogin } = await import('./use-login');
    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper() });

    // Act
    result.current.login({ email: 'player@test.com', password: 'secret123' });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('exposes an error message when login API rejects', async () => {
    // Arrange
    const { login: mockLogin } = await import('../../lib/api/auth.api');
    vi.mocked(mockLogin).mockRejectedValueOnce(
      new Error('Invalid credentials'),
    );

    const { useLogin } = await import('./use-login');
    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper() });

    // Act
    result.current.login({ email: 'bad@test.com', password: 'wrong' });

    await waitFor(() => expect(result.current.error).not.toBeNull());

    // Assert
    expect(result.current.error).toBe('Invalid credentials');
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
