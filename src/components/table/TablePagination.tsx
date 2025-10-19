import { DataConfig } from '@/utils/hooks/useDefaultDataConfig';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageConfig: DataConfig;
  setPageConfig: React.Dispatch<React.SetStateAction<DataConfig>>;
  disabled?: boolean;
}

export default function TablePagination({
  currentPage,
  totalPages,
  pageConfig,
  setPageConfig,
  disabled = false,
}: Readonly<PaginationProps>) {
  const handlePageChange = useCallback((newConfig: React.SetStateAction<Partial<DataConfig>>) => {
    setPageConfig(prev => ({ ...prev, ...newConfig }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reusable function to create page buttons
  const createPageButton = (pageIndex: number) => (
    <button
      key={pageIndex}
      onClick={() => handlePageChange({ page: pageIndex })}
      disabled={disabled}
      className={`rounded px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50 ${
        currentPage === pageIndex
          ? 'bg-active text-main-blue-alurkerja'
          : 'bg-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      {pageIndex + 1}
    </button>
  );

  // Reusable function to create ellipsis
  const createEllipsis = (key: string) => (
    <span key={key} className="px-3 py-1 text-slate-400">
      ...
    </span>
  );

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 0; i < totalPages; i++) {
        pages.push(createPageButton(i));
      }
    } else {
      // Always show first page
      pages.push(createPageButton(0));

      let startPage, endPage;

      if (currentPage <= 3) {
        // Near the beginning: show 1, 2, 3, 4, ..., last
        startPage = 1;
        endPage = 3;
      } else if (currentPage >= totalPages - 4) {
        // Near the end: show 1, ..., last-3, last-2, last-1, last
        startPage = totalPages - 4;
        endPage = totalPages - 2;
      } else {
        // In the middle: show 1, ..., current-1, current, current+1, ..., last
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }

      // Add ellipsis after first page if needed
      if (startPage > 1) {
        pages.push(createEllipsis('start'));
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        if (i > 0 && i < totalPages - 1) {
          pages.push(createPageButton(i));
        }
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 2) {
        pages.push(createEllipsis('end'));
      }

      // Always show last page (if there's more than 1 page)
      if (totalPages > 1) {
        pages.push(createPageButton(totalPages - 1));
      }
    }

    return pages;
  };

  return (
    <div className="mt-4 p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="text-black flex cursor-pointer flex-row items-center rounded-lg border px-[15px] py-2 align-middle text-sm hover:bg-slate-100 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => handlePageChange({ page: currentPage - 1 })}
            disabled={disabled || currentPage === 0}
          >
            <ChevronLeft size={14} className="mr-1" />
            Previous
          </button>

          <div className="flex items-center gap-1 text-sm">{renderPageNumbers()}</div>

          <button
            className="text-black flex cursor-pointer flex-row items-center rounded-lg border px-[15px] py-2 align-middle text-sm hover:bg-slate-100 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => handlePageChange({ page: currentPage + 1 })}
            disabled={disabled || currentPage === totalPages - 1}
          >
            Next
            <ChevronRight size={14} className="ml-1" />
          </button>
        </div>
        <div className="flex items-center text-sm">
          <label htmlFor="rows-per-page" className="mr-2 text-slate-500">
            Rows per page:
          </label>
          <select
            id="rows-per-page"
            className="cursor-pointer rounded-lg border px-[15px] py-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            value={pageConfig.limit}
            onChange={e => handlePageChange({ limit: Number(e.target.value) })}
            disabled={disabled}
          >
            {[10, 25, 50, 100].map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
