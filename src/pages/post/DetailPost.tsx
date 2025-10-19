import { VerticalGaps } from '@/components/ui/container';
import { H3 } from '@/components/ui/typography';
import ShowPost from '@/features/features/post/ShowPost';

export default function DetailPost() {
  return (
    <section className="mx-auto w-3/4 min-w-[800px] rounded-xl bg-white p-5">
      <VerticalGaps>
        <H3>Detail Post</H3>

        <ShowPost />
      </VerticalGaps>
    </section>
  );
}