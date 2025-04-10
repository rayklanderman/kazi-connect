import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/auth.store';
import { MainLayout } from '@/components/layout/MainLayout';

export function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
