import { useAuthStore } from '@/stores/auth.store';
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — inject latest token
axiosInstance.interceptors.request.use(
  config => {
    const token = useAuthStore.getState().token; // ✅ access store without React context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor — global error handling
axiosInstance.interceptors.response.use(
  response => response, // happy path
  error => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access: ', error.response?.data?.message);
      const { resetToken, resetCurrentUser } = useAuthStore.getState();
      resetToken();
      resetCurrentUser();
      window.location.href = '/login';
      // navigate outside React
    }
    return Promise.reject(error); // ❗ ensure it goes to React Query's onError
  },
);
