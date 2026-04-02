import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { useAuthStore } from '../../lib/stores/auth.store';

beforeEach(() => {
  useAuthStore.getState().logout();
});

function renderWithRouter(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>Home Page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    renderWithRouter('/');
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    useAuthStore.getState().login({
      user: {
        id: '1',
        email: 'a@a.com',
        name: 'Test',
        role: 'MEMBER',
        tenantId: 't1',
      },
      accessToken: 'token',
      refreshToken: 'refresh',
    });
    renderWithRouter('/');
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});
