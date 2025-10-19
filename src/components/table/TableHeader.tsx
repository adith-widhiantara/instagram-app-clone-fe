import { Input } from 'alurkerja-ui';
import { Search, Plus, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReactNode, useEffect, useMemo, useState, type ElementType } from 'react';
import { DefaultButton } from '../ui/button';
import { DataConfig } from '@/utils/hooks/useDefaultDataConfig';
import TableFilter from './TableFilter';
import { FiltersTable } from '@/utils/types/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import PermissionWrapper from './TablePermissionWrapper';

export interface TableHeaderProps {
  title: string;
  pageConfig: DataConfig;
  setPageConfig: React.Dispatch<React.SetStateAction<DataConfig>>;
  hideAddButton?: boolean;
  actionPath?: string;
  actionLabel?: string;
  actionIcon?: ElementType;
  filters?: FiltersTable[];
  disableAddButton?: boolean;
  hideSearchInput?: boolean;
  // New dropdown props
  showDropdown?: boolean;
  dropdownContent?: ReactNode;
  dropdownLabel?: string;
  dropdownIcon?: ElementType;
  dropdownButtonClassname?: string;
  customContentHeaderRight?: ReactNode;
  resourceName?: string;
}

export default function TableHeader(props: Readonly<TableHeaderProps>) {
  const {
    title,
    pageConfig,
    setPageConfig,
    actionPath = 'add',
    actionLabel = 'Add',
    hideAddButton = false,
    actionIcon,
    filters,
    disableAddButton = false,
    hideSearchInput = false,
    // New dropdown props
    showDropdown = false,
    dropdownContent,
    dropdownLabel = 'Actions',
    dropdownIcon,
    dropdownButtonClassname = '',
    customContentHeaderRight,
    resourceName,
  } = props;
  const navigate = useNavigate();
  const Icon = actionIcon || Plus;
  const DropdownIcon = dropdownIcon || ChevronDown;
  const [localSearch, setLocalSearch] = useState(pageConfig.search ?? '');

  // keep local state in sync if parent search changes externally
  useEffect(() => {
    setLocalSearch(pageConfig.search ?? '');
  }, [pageConfig.search]);

  // Debounce: update pageConfig.search after 500ms of inactivity
  useEffect(() => {
    if (!setPageConfig) return; // optional wiring
    const handle = setTimeout(() => {
      setPageConfig(prev => ({ ...prev, search: localSearch, page: 0 }));
    }, 500);
    return () => clearTimeout(handle);
  }, [localSearch, setPageConfig]);

  const onChangeSearch = useMemo(
    () => (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearch(e.target.value);
    },
    [],
  );
  return (
    <div className={`flex items-center justify-between py-5`}>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold">{title ?? 'Title'}</h1>
      </div>
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-2">
          {!hideSearchInput && (
            <div className="w-72">
              <Input
                placeholder="Search"
                name="search"
                size="sm"
                rounded="lg"
                prefix={<Search size={16} />}
                value={localSearch}
                onChange={onChangeSearch}
              />
            </div>
          )}
          <div>
            <TableFilter filters={filters} pageConfig={pageConfig} setPageConfig={setPageConfig} />
          </div>

          {customContentHeaderRight}

          {/* Popover Actions */}
          {showDropdown && (
            <PermissionWrapper perform={`${resourceName}.store`} resourceName={resourceName}>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={`text-black flex cursor-pointer flex-row items-center rounded-lg border px-[15px] py-2 align-middle text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 ${dropdownButtonClassname}`}
                  >
                    {<DropdownIcon size={14} className="mr-1" />}
                    {dropdownLabel}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end">{dropdownContent}</PopoverContent>
              </Popover>
            </PermissionWrapper>
          )}

          {!hideAddButton && (
            <PermissionWrapper perform={`${resourceName}.store`} resourceName={resourceName}>
              <DefaultButton onClick={() => navigate(actionPath)} disabled={disableAddButton}>
                <span className="flex items-center">
                  <Icon size={14} className="mr-1" />
                  {actionLabel}
                </span>
              </DefaultButton>
            </PermissionWrapper>
          )}
        </div>
      </div>
    </div>
  );
}
