import { axiosInstance } from '@/utils/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type AddPostPayload = {
  image: File,
  caption: string
};

async function addPost(data: AddPostPayload) {
  try {
    return await axiosInstance.postForm('/api/post', data);
  } catch (error) {
    console.error('add post error:', error);
    return Promise.reject<Error>(error);
  }
}

function useAddPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('add post error:', error);
    },
  });
}

interface PostsInterface {
  data: {
    content: {
      id: number
      caption: string,
      image_url: string
    }[]
  };
}

async function getPosts() {
  const response = await axiosInstance.get<PostsInterface>(`/api/post`);
  return response.data.data;
}

function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('Get posts error:', error);
    },
  });
}

export { useAddPost, usePosts };
