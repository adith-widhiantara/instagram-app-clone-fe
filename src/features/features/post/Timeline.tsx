import { usePosts } from '@/api/post';
import Content from '@/features/features/post/components/Content';

export default function Timeline() {
  const {
    data,
  } = usePosts();

  return (
    <>
      {data && data.content.map((post) => (
        <Content
          id={post.id}
          caption={post.caption}
          image_url={post.image_url}
          author={post.user.name}
          is_detail={false}
        />
      ))}
    </>
  );
}