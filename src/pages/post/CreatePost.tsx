import { VerticalGaps } from '@/components/ui/container';
import { H3 } from '@/components/ui/typography';
import PostAddForm from '@/features/features/post/PostAddForm';

export default function CreatePost() {
  return (
    <section className="mx-auto w-3/4 min-w-[800px] rounded-xl bg-white p-5">
      <VerticalGaps>
        <H3>Create New Post</H3>
        <PostAddForm />
      </VerticalGaps>
    </section>
  );
}