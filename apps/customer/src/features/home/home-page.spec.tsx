/**
 * HomePage — unit tests
 *
 * Scenario 3: Home screen with memberships
 * GIVEN the user has active memberships
 * WHEN they navigate to the Home screen
 * THEN a summary of memberships is displayed
 * AND a horizontal scroll of academies is shown
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement, type ReactNode } from 'react';
import { useAuthStore } from '../../lib/stores/auth.store';
import { HomePage } from './home-page';

// ── Module mocks ─────────────────────────────────────────────────────────────

// Prevent client.ts from throwing at module init (VITE_TENANT_ID not set in tests)
vi.mock('../../lib/api/client', () => ({
  publicClient: {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
  authClient: {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
}));

vi.mock('./use-home-data');

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, null, children),
    );
  };
}

function renderPage() {
  const Wrapper = makeWrapper();
  return render(createElement(HomePage), { wrapper: Wrapper });
}

// ── Object Mothers ────────────────────────────────────────────────────────────

const MembershipMother = {
  active: (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: 'mem-1',
    tenantId: 'tenant-1',
    memberId: 'user-1',
    businessUnitId: 'bu-1',
    status: 'ACTIVE',
    startDate: '2024-01-01T00:00:00.000Z',
    endDate: '2025-01-01T00:00:00.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }),
};

const BusinessUnitMother = {
  academy: (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: 'bu-1',
    tenantId: 'tenant-1',
    name: 'Academia Los Tigres',
    type: 'BASEBALL_ACADEMY',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('HomePage', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    localStorage.clear();
    useAuthStore.getState().login({
      user: {
        id: 'user-1',
        email: 'player@test.com',
        name: 'Juan Pérez',
        role: 'MEMBER',
        tenantId: 'tenant-1',
      },
      accessToken: 'access',
      refreshToken: 'refresh',
    });
  });

  describe('when data is loaded', () => {
    it('displays membership cards in the summary section', async () => {
      // Arrange
      const { useHomeData } = await import('./use-home-data');
      vi.mocked(useHomeData).mockReturnValue({
        memberships: [MembershipMother.active()],
        academies: [BusinessUnitMother.academy()],
        isLoading: false,
        hasError: false,
        isEmpty: false,
        hasData: true,
      } as ReturnType<typeof useHomeData>);

      // Act
      renderPage();

      // Assert — MembershipsSummary renders "My Memberships" section
      expect(screen.getByText('My Memberships')).toBeInTheDocument();
      // The MembershipsSummary renders "Membership" for each active card
      expect(screen.getByText('Membership')).toBeInTheDocument();
    });

    it('displays academy cards in the horizontal scroll section', async () => {
      // Arrange
      const { useHomeData } = await import('./use-home-data');
      vi.mocked(useHomeData).mockReturnValue({
        memberships: [MembershipMother.active()],
        academies: [BusinessUnitMother.academy()],
        isLoading: false,
        hasError: false,
        isEmpty: false,
        hasData: true,
      } as ReturnType<typeof useHomeData>);

      // Act
      renderPage();

      // Assert — AcademiesScroll renders academy names
      expect(screen.getByText('My Academies')).toBeInTheDocument();
      expect(screen.getByText('Academia Los Tigres')).toBeInTheDocument();
    });

    it('greets the user by first name', async () => {
      // Arrange
      const { useHomeData } = await import('./use-home-data');
      vi.mocked(useHomeData).mockReturnValue({
        memberships: [MembershipMother.active()],
        academies: [],
        isLoading: false,
        hasError: false,
        isEmpty: false,
        hasData: true,
      } as ReturnType<typeof useHomeData>);

      // Act
      renderPage();

      // Assert — greeting uses first name only
      expect(screen.getByText(/Hey, Juan/)).toBeInTheDocument();
    });
  });

  describe('when data is loading', () => {
    it('renders skeleton cards while loading', async () => {
      // Arrange
      const { useHomeData } = await import('./use-home-data');
      vi.mocked(useHomeData).mockReturnValue({
        memberships: [],
        academies: [],
        isLoading: true,
        hasError: false,
        isEmpty: false,
        hasData: false,
      } as ReturnType<typeof useHomeData>);

      // Act
      const { container } = renderPage();

      // Assert — SkeletonCard renders divs with "animate-pulse" class
      const skeletonCards = container.querySelectorAll('.animate-pulse');
      expect(skeletonCards.length).toBeGreaterThan(0);
    });

    it('shows a loading message', async () => {
      // Arrange
      const { useHomeData } = await import('./use-home-data');
      vi.mocked(useHomeData).mockReturnValue({
        memberships: [],
        academies: [],
        isLoading: true,
        hasError: false,
        isEmpty: false,
        hasData: false,
      } as ReturnType<typeof useHomeData>);

      // Act
      renderPage();

      // Assert
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('when no data is available (new user)', () => {
    it('renders the empty state message', async () => {
      // Arrange
      const { useHomeData } = await import('./use-home-data');
      vi.mocked(useHomeData).mockReturnValue({
        memberships: [],
        academies: [],
        isLoading: false,
        hasError: false,
        isEmpty: true,
        hasData: true,
      } as ReturnType<typeof useHomeData>);

      // Act
      renderPage();

      // Assert
      expect(screen.getByText('Welcome to The Stadium!')).toBeInTheDocument();
    });
  });
});
