/**
 * Axios instances for the customer app.
 *
 * Two clients:
 *  - `publicClient`  — unauthenticated requests (login, register); injects x-tenant-id.
 *  - `authClient`    — authenticated requests; injects Bearer token, handles 401 refresh.
 *
 * AD-1: single-inflight refreshPromise prevents duplicate refresh calls.
 * AD-3: VITE_TENANT_ID is validated at module init — throws if absent.
 */

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

// ── AD-3: Tenant ID validation ──────────────────────────────────────────────

const tenantId: string = import.meta.env['VITE_TENANT_ID'] as string;

if (!tenantId) {
  throw new Error('VITE_TENANT_ID is not set. Add it to .env.local');
}

const baseURL: string =
  (import.meta.env['VITE_API_URL'] as string | undefined) ??
  'http://localhost:3000/api/v1';

// ── Public client (login / register) ────────────────────────────────────────

export const publicClient: AxiosInstance = axios.create({ baseURL });

publicClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    config.headers['x-tenant-id'] = tenantId;
    return config;
  },
);

// ── Auth client (authenticated requests) ────────────────────────────────────

export const authClient: AxiosInstance = axios.create({ baseURL });

/** Lazily import auth store to avoid circular dependency at module init. */
async function getAuthStore() {
  const { useAuthStore } = await import('../stores/auth.store');
  return useAuthStore;
}

// Request interceptor — inject Bearer token
authClient.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    const store = await getAuthStore();
    const { accessToken } = store.getState();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
);

// ── AD-1: Single-inflight refresh promise ───────────────────────────────────

let refreshPromise: Promise<void> | null = null;

// Response interceptor — handle 401 with token refresh
authClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: unknown) => {
    const store = await getAuthStore();

    // Only intercept 401 errors with a valid response
    if (
      !axios.isAxiosError(error) ||
      error.response?.status !== 401 ||
      !error.config
    ) {
      return Promise.reject(error);
    }

    const originalConfig = error.config;

    // If no refresh token available, log out immediately
    const { refreshToken } = store.getState();
    if (!refreshToken) {
      store.getState().logout();
      return Promise.reject(error);
    }

    try {
      // AD-1: Queue all concurrent 401s behind a single refresh call
      if (refreshPromise === null) {
        refreshPromise = (async () => {
          try {
            const { refreshTokens } = await import('./auth.api');
            const tokens = await refreshTokens({ refreshToken });
            store.getState().setTokens({
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
            });
          } finally {
            refreshPromise = null;
          }
        })();
      }

      await refreshPromise;

      // Retry original request with new access token
      const { accessToken: newAccessToken } = store.getState();
      originalConfig.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return authClient(originalConfig);
    } catch {
      store.getState().logout();
      return Promise.reject(error);
    }
  },
);
