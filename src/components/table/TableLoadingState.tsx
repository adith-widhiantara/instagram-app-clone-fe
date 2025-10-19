import { DataConfig } from '@/utils/hooks/useDefaultDataConfig';
import { TableColumn } from '@/utils/types/table';
import { Skeleton } from 'alurkerja-ui';

interface TableLoadingStateProps {
  pageConfig: DataConfig;
  columns: TableColumn[];
  showActions?: boolean;
}

export default function TableLoadingState({ pageConfig, columns, showActions }: Readonly<TableLoadingStateProps>) {
  return Array.from({ length: pageConfig.limit }, (_, rowIndex) => (
    <tr key={`skeleton-${rowIndex}`} data-testid={`skeleton-loading`} className="border-b bg-white">
      <td className="px-3 py-2 text-center">
        <Skeleton className="h-7" />
      </td>
      {columns.map(column => (
        <td key={`skeleton-${rowIndex}-${column.name}`} className={`px-3 py-2 ${column.className ?? ''}`}>
          <Skeleton className="h-7" />
        </td>
      ))}
      {showActions && (
        <td className="px-3 py-2">
          <Skeleton className="h-7" />
        </td>
      )}
    </tr>
  ));
}
