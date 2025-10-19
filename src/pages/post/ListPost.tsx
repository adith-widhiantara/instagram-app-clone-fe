import { VerticalGaps } from '@/components/ui/container';
import { H3 } from '@/components/ui/typography';
import Timeline from '@/features/features/post/Timeline';

export default function ListPost() {
  return (
    <section className="mx-auto w-3/4 min-w-[800px] rounded-xl bg-white p-5">
      <VerticalGaps>
        <H3>List Post</H3>

        <Timeline />
      </VerticalGaps>
    </section>
  );
}