import { axiosInstance } from '@/utils/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type AddFollowPayload = {
  user_id: number
};

interface UsersInterface {
  data: {
    content: {
      id: number
      name: string
    }[]
  };
}

async function getUsers() {
  const response = await axiosInstance.get<UsersInterface>(`/api/user`);
  return response.data.data;
}

function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('Get users error:', error);
    },
  });
}

// follow-user

async function addFollowUser(data: AddFollowPayload) {
  try {
    return await axiosInstance.postForm('/api/follow/follow-user', data);
  } catch (error) {
    console.error('add post error:', error);
    return Promise.reject<Error>(error);
  }
}

function useAddFollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addFollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-user'] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('add follow-user error:', error);
    },
  });
}

export { useUsers, useAddFollowUser };