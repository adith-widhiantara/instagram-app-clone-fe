import { axiosInstance } from '@/utils/lib/axios';
import { QueryFunctionContext, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type AddPostPayload = {
  image: File,
  caption: string
};

type AddLikePayload = {
  user_id: number
  post_id: number
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

interface PostInterface {
  data: {
    id: number
    caption: string,
    image_url: string
    likes: any[],
    comments: any[],
  };
}

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

async function getPost(queryFunctionContext: QueryFunctionContext) {
  const { queryKey } = queryFunctionContext;
  const [_, paramsDataConfig] = queryKey;
  const { id } = paramsDataConfig as { id: number };

  const response = await axiosInstance.get<PostInterface>(`/api/post/${id}`);
  return response.data.data;
}

function useShowPost(params: { id: number }) {
  return useQuery({
    queryKey: ['post', { id: params.id }],
    queryFn: getPost,
  });
}

// like

async function addLike(data: AddLikePayload) {
  try {
    return await axiosInstance.postForm('/api/like', data);
  } catch (error) {
    console.error('add post error:', error);
    return Promise.reject<Error>(error);
  }
}

function useAddLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['like'] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('add like error:', error);
    },
  });
}

export { useAddPost, usePosts, useShowPost, useAddLike };
