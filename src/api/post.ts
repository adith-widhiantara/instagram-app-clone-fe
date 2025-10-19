import { axiosInstance } from '@/utils/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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

export { useAddPost };
