/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataConfig } from '@/utils/hooks/useDefaultDataConfig';
import { FiltersTable } from '@/utils/types/table';
import { useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Filter } from 'lucide-react';
import { VerticalGaps } from '../ui/container';
import { FormContainer } from '../form/form-container';
import { useForm } from 'react-hook-form';

interface TableFilterProps {
  // Define any props your filter component might need
  pageConfig: DataConfig;
  setPageConfig: React.Dispatch<React.SetStateAction<DataConfig>>;
  filters?: FiltersTable[];
}

export default function TableFilter(props: Readonly<TableFilterProps>) {
  const { pageConfig, setPageConfig, filters = [] } = props;

  // Extract filter values from pageConfig with prefix "filter"
  const initialFilterValues = useMemo(() => {
    const filterValues: { [x: string]: any } = {};
    Object.keys(pageConfig).forEach(key => {
      if (key.startsWith('filter[') && key.endsWith(']')) {
        // Extract the filter name from "filter[name]" format
        const filterName = key.substring(7, key.length - 1);
        filterValues[filterName] = pageConfig[key];
      }
    });
    return filterValues;
  }, [pageConfig]);

  const filterForm = useForm({
    defaultValues: initialFilterValues,
  });

  const handleReset = () => {
    // remove key of pageConfig that are the prefix is filter
    const newConfig = { ...pageConfig };
    Object.keys(newConfig).forEach(key => {
      if (key.startsWith('filter')) {
        delete newConfig[key];
      }
    });
    setPageConfig(newConfig);

    // Reset form values and update default values to empty
    const emptyValues = Object.keys(initialFilterValues).reduce(
      (acc, key) => {
        acc[key] = '';
        return acc;
      },
      {} as { [x: string]: any },
    );

    filterForm.reset(emptyValues);
  };

  const handleSubmit = (dataFilter: any) => {
    // Update the pageConfig with the filter values
    // add prefix filter[filters.name] if filters.name exists
    const newFilters = Object.keys(dataFilter).reduce(
      (acc, key) => {
        const filterItem = filters.find(item => item.name === key);
        if (filterItem) {
          acc[`filter[${filterItem.name}]`] = dataFilter[key];
        }
        return acc;
      },
      {} as { [x: string]: any },
    );

    setPageConfig(prev => ({ ...prev, ...newFilters }));
  };

  if (filters.length === 0) {
    return null; // Return null if no filters are provided
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-black flex cursor-pointer flex-row items-center rounded-lg border px-[15px] py-2 align-middle text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">
          <Filter size={14} className="mr-1" />
          Filter
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <FormContainer form={filterForm} onSubmit={handleSubmit}>
          <VerticalGaps>
            {filters.map(filterItem => (
              <div key={filterItem.name}>{filterItem.render(filterItem)}</div>
            ))}
            <div className="flex items-center gap-x-2">
              <button
                type="reset"
                className="text-black flex w-full border-spacing-6 cursor-pointer flex-row items-center justify-center rounded-lg border py-2 align-middle text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                type="submit"
                className="flex w-full border-spacing-6 cursor-pointer flex-row items-center justify-center rounded-lg border bg-main-blue-alurkerja py-2 align-middle text-sm text-white hover:bg-main-blue-alurkerja-hovered disabled:cursor-not-allowed disabled:opacity-50"
              >
                Filter
              </button>
            </div>
          </VerticalGaps>
        </FormContainer>
      </PopoverContent>
    </Popover>
  );
}
