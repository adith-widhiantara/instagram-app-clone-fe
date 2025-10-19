import { useShowPost } from '@/api/post';
import { useParams } from 'react-router-dom';
import Content from '@/features/features/post/components/Content';

export default function ShowPost() {
  const { id } = useParams();

  const {
    data,
  } = useShowPost({
    id: Number(id || 0),
  });


  return (
    <>
      {data && (
        <Content
          id={Number(id || 0)}
          caption={data.caption}
          image_url={data.image_url}
          data={data}
          author={data.user.name}
          is_detail={true}
        />
      )}
    </>
  );
}