import { useAuthStore } from '@/stores/auth.store';
import { Spinner } from 'alurkerja-ui';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type ProtectedRouteProps = {
  layout: React.FC;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ layout: Layout }) => {
  const { token, resetCurrentUser, resetToken, resetRole } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Validasi token
    if (!token) {
      console.error('No token found, redirecting to login');
      resetRole();
      resetToken();
      resetCurrentUser();
      localStorage.removeItem('auth-storage'); // Clear any stored auth data
      navigate('/login');
    }
  }, [token, navigate, resetCurrentUser, resetToken, resetRole]);

  if (!token) {
    return (
      <div className="fixed flex h-screen w-screen items-center justify-center gap-2">
        <Spinner className="text-primary" />
        Loading...
      </div>
    );
  }

  return <Layout />;
};
