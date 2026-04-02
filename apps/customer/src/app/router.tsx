import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ProtectedRoute } from '../shared/layout/protected-route';
import { BottomNav } from '../shared/layout/bottom-nav';
import { LoginPage } from '../features/auth/login-page';
import { HomePage } from '../features/home/home-page';
import { ProfilePage } from '../features/profile/profile-page';
import { MembershipsPage } from '../features/memberships/memberships-page';
import { AcademiesPage } from '../features/academies/academies-page';

// Layout with bottom nav for authenticated screens
function AppLayout() {
  return (
    <div className="min-h-screen bg-[#0B1220] pb-16">
      <Outlet />
      <BottomNav />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/memberships', element: <MembershipsPage /> },
          { path: '/academies', element: <AcademiesPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
