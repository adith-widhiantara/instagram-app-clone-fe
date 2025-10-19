import { axiosInstance } from '@/utils/lib/axios';
import { useQuery } from '@tanstack/react-query';

async function getProfile() {
  try {
    const response = await axiosInstance.get(import.meta.env.VITE_API_URL + '/api/profile', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
}

function useGetProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('Get profile error:', error);
    },
  });
}

export { useGetProfile };
