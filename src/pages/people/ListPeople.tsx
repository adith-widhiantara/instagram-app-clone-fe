import { VerticalGaps } from '@/components/ui/container';
import { H3 } from '@/components/ui/typography';
import Peoples from '@/features/features/people/Peoples';

export default function ListPeople() {
  return (
    <section className="mx-auto w-3/4 min-w-[800px] rounded-xl bg-white p-5">
      <VerticalGaps>
        <H3>List People</H3>

        <Peoples />
      </VerticalGaps>
    </section>
  );
}