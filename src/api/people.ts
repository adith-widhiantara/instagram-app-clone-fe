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
      followers: {
        id: number
      }[]
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

// unfollow-user

async function addUnfollowUser(data: AddFollowPayload) {
  try {
    return await axiosInstance.postForm('/api/follow/unfollow-user', data);
  } catch (error) {
    console.error('add unfollow error:', error);
    return Promise.reject<Error>(error);
  }
}

function useAddUnfollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addUnfollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unfollow-user'] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('add unfollow-user error:', error);
    },
  });
}

export { useUsers, useAddFollowUser, useAddUnfollowUser };