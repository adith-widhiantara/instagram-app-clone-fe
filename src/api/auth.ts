import { useAuthStore } from '@/stores/auth.store';
import { axiosInstance } from '@/utils/lib/axios';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

async function login(credential: { email: string; password: string }) {
  try {
    return await axios.post(import.meta.env.VITE_API_URL + '/api/auth/login', credential, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

function useLogin() {
  return useMutation({
    mutationFn: login,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('Login error:', error);
    },
  });
}

async function logout() {
  return await axiosInstance.post('/auth/logout', null, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function useLogout() {
  const navigate = useNavigate();
  const { resetToken, resetCurrentUser } = useAuthStore();

  return useMutation({
    mutationFn: logout,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: () => {
      resetToken();
      resetCurrentUser();
      navigate('/login');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('Logout error:', error);
    },
  });
}

export { useLogin, useLogout };
