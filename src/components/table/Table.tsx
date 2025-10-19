import { EyeIcon, ArrowUp, ArrowDown, LucidePencil, Trash } from 'lucide-react';
import { useCallback } from 'react';
import { DataConfig } from '@/utils/hooks/useDefaultDataConfig';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import TableHeader, { TableHeaderProps } from './TableHeader';
import TableLoadingState from './TableLoadingState';
import TablePagination from './TablePagination';
import TableEmptyState from './TableEmptyState';
import getNestedValue from '@/utils/helpers/getNestedValue';
import { PaginatedData, TableColumn } from '@/utils/types/table';
import { swalDelete } from '@/utils/lib/swal';
import { Spinner } from 'alurkerja-ui';
import PermissionWrapper from './TablePermissionWrapper';

type TableItem = Record<string, unknown> & { id: string; show_action_button?: boolean };

interface TableRequestProps {
  loading?: boolean;
  data: PaginatedData;
  pageConfig: DataConfig;
  setPageConfig: React.Dispatch<React.SetStateAction<DataConfig>>;
  columns: TableColumn[];
  disableAddButton?: boolean;
  showActions?: boolean;
  showDelete?: boolean;
  showActionButtonByBackend?: boolean;
  hidePagination?: boolean;
  onConfirmDelete?: (id: string) => void;
  isLoadingDelete?: boolean;
  resourceName?: string;
}

export default function Table(props: Readonly<TableRequestProps & TableHeaderProps>) {
  const {
    loading = false,
    data = { content: [], total_elements: 0, total_page: 0 },
    pageConfig,
    setPageConfig,
    columns,
    showActions = true,
    showDelete = false,
    showActionButtonByBackend = false,
    hidePagination = false,
    isLoadingDelete = false,
    resourceName,
  } = props;

  const navigate = useNavigate();

  const calculateRowNumber = useCallback(
    (index: number): number => {
      const { page, limit } = pageConfig;
      const hasValidPagination = page !== undefined && limit !== undefined && typeof page === 'number' && limit > 0;

      return hasValidPagination ? page * limit + index + 1 : index + 1;
    },
    [pageConfig],
  );

  const handleSort = useCallback(
    (columnName: string) => {
      const isCurrentlySorted = pageConfig.sort === columnName;
      const newDirection = isCurrentlySorted && pageConfig.direction === 'asc' ? 'desc' : 'asc';

      setPageConfig(prev => ({
        ...prev,
        sort: columnName,
        direction: newDirection,
      }));
    },
    [pageConfig.sort, pageConfig.direction, setPageConfig],
  );

  const getSortIcon = useCallback(
    (columnName: string) => {
      if (pageConfig.sort !== columnName) {
        return null;
      }
      return pageConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    },
    [pageConfig.sort, pageConfig.direction],
  );

  const handleDelete = useCallback(
    (id: string) => {
      swalDelete.fire().then(result => {
        if (result.isConfirmed) {
          props.onConfirmDelete?.(id);
        }
      });
    },
    [props],
  );

  const renderActionButtons = useCallback(
    (item: TableItem) => {
      if (showActionButtonByBackend && !item.show_action_button) {
        return null;
      }

      return (
        <div className="flex flex-row items-center justify-center gap-1">
          <PermissionWrapper perform={`${resourceName}.show`} resourceName={resourceName}>
            <button
              className="rounded-lg bg-active p-1.5 text-main-blue-alurkerja duration-300 hover:bg-slate-300"
              onClick={() => navigate(`${item.id}`)}
              aria-label="View details"
              title="View details"
            >
              <EyeIcon size={16} />
            </button>
          </PermissionWrapper>
          <PermissionWrapper perform={`${resourceName}.update`} resourceName={resourceName}>
            <button
              className="rounded-lg bg-active p-1.5 text-main-blue-alurkerja duration-300 hover:bg-slate-300"
              onClick={() => navigate(`${item.id}/edit`)}
              aria-label="Edit item"
              title="Edit item"
            >
              <LucidePencil size={16} />
            </button>
          </PermissionWrapper>
          {showDelete && (
            <PermissionWrapper perform={`${resourceName}.destroy`} resourceName={resourceName}>
              <button
                className="rounded-lg bg-red-100 p-1.5 text-red-500 duration-300 hover:bg-red-300 disabled:pointer-events-none disabled:cursor-not-allowed"
                onClick={() => handleDelete(item.id)}
                aria-label="Delete item"
                title="Delete item"
                disabled={isLoadingDelete}
              >
                {isLoadingDelete ? <Spinner size={16} /> : <Trash size={16} />}
              </button>
            </PermissionWrapper>
          )}
        </div>
      );
    },
    [showActionButtonByBackend, navigate, showDelete, handleDelete, isLoadingDelete, resourceName],
  );

  const renderTableRow = useCallback(
    (item: TableItem, index: number) => (
      <tr className="border-b bg-white" key={item.id}>
        <td className="p-3 text-center">{calculateRowNumber(index)}</td>
        {columns.map(column => (
          <td key={column.name} className={`p-3 ${column.className ?? ''}`}>
            {column.render ? column.render(item[column.name], item, index) : getNestedValue(item, column.name) ?? '-'}
          </td>
        ))}
        {showActions && <td className="p-3">{renderActionButtons(item)}</td>}
      </tr>
    ),
    [calculateRowNumber, columns, showActions, renderActionButtons],
  );

  const renderTableHeader = useCallback(
    () => (
      <thead className="bg-slate-100 text-xs text-gray-700">
        <tr>
          <th scope="col" className="w-4 p-3 text-center">
            No
          </th>
          {columns.map(column => (
            <th key={column.name} scope="col" className={`min-w-32 p-3 ${column.className ?? ''}`}>
              <button
                className={clsx('flex cursor-pointer items-center gap-1', {
                  'font-medium text-main-blue-alurkerja hover:text-main-blue-alurkerja-hovered':
                    pageConfig.sort === column.name,
                })}
                onClick={() => handleSort(column.name)}
              >
                {column.label}
                {getSortIcon(column.name)}
              </button>
            </th>
          ))}
          {showActions && (
            <th scope="col" className="w-28 p-3 text-center">
              Action
            </th>
          )}
        </tr>
      </thead>
    ),
    [columns, pageConfig.sort, handleSort, getSortIcon, showActions],
  );

  const hasData = !loading && data?.content?.length > 0;
  const isEmpty = !loading && !data?.content?.length;
  const colSpan = columns.length + (showActions ? 2 : 1);

  return (
    <section className="w-full grow rounded bg-white pb-10">
      <TableHeader {...props} />
      <div className="overflow-x-hidden">
        <div className="overflow-x-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full table-auto rounded-lg text-left text-sm text-gray-500">
              {renderTableHeader()}
              <tbody>
                {loading && <TableLoadingState pageConfig={pageConfig} columns={columns} showActions={showActions} />}

                {isEmpty && <TableEmptyState colSpan={colSpan} />}

                {hasData && (data.content as TableItem[]).map((item, index) => renderTableRow(item, index))}
              </tbody>
            </table>
          </div>

          {!hidePagination && (
            <TablePagination
              currentPage={pageConfig.page}
              totalPages={data?.total_page || 0}
              pageConfig={pageConfig}
              setPageConfig={setPageConfig}
              disabled={loading}
            />
          )}
        </div>
      </div>
    </section>
  );
}
