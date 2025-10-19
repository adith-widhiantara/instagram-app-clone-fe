import { TableColumn } from '@/utils/types/table';
import Table from './Table';
import { useDefaultDataConfig } from '@/utils/hooks/useDefaultDataConfig';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TableLogHistory({ data, spec, title }: { data: any; spec: TableColumn[]; title: string }) {
  const { dataConfig, setDataConfig } = useDefaultDataConfig();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent className="p-2">
          <Table
            title=""
            actionLabel="Add Client"
            data={{ content: data ?? [], total_elements: data?.length ?? 0, total_page: 1 }}
            columns={spec}
            pageConfig={dataConfig}
            setPageConfig={setDataConfig}
            showActions={false}
            hideAddButton
            hidePagination
            hideSearchInput
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
