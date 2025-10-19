import { Badge } from './badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { LucideCheck, LucidePlusCircle, Search } from 'lucide-react';
import { useCommandState } from 'cmdk';
import { useMemo } from 'react';
import { cn } from '@/utils/helpers/cn';

interface MultiSelectProps {
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  selectedValues: Set<string>;
  onSelectionChange: (selectedValues: Set<string>) => void;
  onReset?: () => void;
  isDisabled?: boolean;
  placeholder?: string;
  search: string;
  setSearch: (value: string) => void;
  searchApi?: boolean;
}

export function MultiSelect({
  title,
  options,
  selectedValues,
  onSelectionChange,
  onReset,
  isDisabled = false,
  placeholder,
  setSearch,
  searchApi,
}: MultiSelectProps) {
  // Derive selected values with labels from options and selectedValues
  const selectedValuesWithLabels = useMemo(() => {
    return options.filter(option => selectedValues.has(option.value));
  }, [options, selectedValues]);

  const debounce = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    func: (...args: any[]) => void,
    wait: number,
  ) => {
    let timeoutId: NodeJS.Timeout | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (this: unknown, ...args: any[]) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  };

  const handleInputChange = debounce(value => {
    setSearch(value);
  }, 500);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {!isDisabled ? (
          <button
            className="text-black disabled:text-black flex h-11 w-full grow-0 items-center gap-x-2 overflow-auto rounded-md border border-[#c4c4c480] px-3 text-sm hover:bg-slate-50 hover:text-white disabled:border-[#E1E1E1] disabled:bg-[#F3F4F6] disabled:bg-transparent disabled:opacity-100 dark:bg-neutral-50"
            disabled={isDisabled}
          >
            <LucidePlusCircle size={16} className="text-slate-400" />
            {selectedValues.size > 0 && (
              <>
                <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                  {selectedValues.size}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selectedValues.size > 3 ? (
                    <Badge variant="secondary" className="rounded-sm px-2 font-semibold">
                      {selectedValues.size} selected
                    </Badge>
                  ) : (
                    selectedValuesWithLabels.map(option => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="whitespace-nowrap rounded-sm px-2 font-semibold"
                      >
                        {option.label}
                      </Badge>
                    ))
                  )}
                </div>
              </>
            )}
            {selectedValues.size === 0 && <div className="text-slate-400">{placeholder ?? ''}</div>}
          </button>
        ) : (
          <SelectTriggerElementDisabled selectedValues={selectedValues} options={options} placeholder={placeholder} />
        )}
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          {!searchApi && (
            <CommandInput
              placeholder={title}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
              }}
            />
          )}

          {searchApi && (
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                className="w-full px-0 py-2 text-sm focus:outline-none"
                onChange={e => {
                  handleInputChange(e.target.value);
                }}
              />
            </div>
          )}

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-y-auto">
              {options.map(option => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const newSelectedValues = new Set(selectedValues);
                      if (isSelected) {
                        newSelectedValues.delete(option.value);
                      } else {
                        newSelectedValues.add(option.value);
                      }
                      onSelectionChange(newSelectedValues);
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-neutral-400',
                        isSelected ? 'bg-main-blue-alurkerja text-white' : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <LucideCheck className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && <option.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            <CommandSeparator />
            <CommandGroup forceMount>
              <SelectAll onSelectionChange={onSelectionChange} options={options} />
            </CommandGroup>

            <CommandSeparator />
            <CommandGroup forceMount>
              <CommandItem
                onSelect={() => {
                  onSelectionChange(new Set());
                  onReset?.();
                }}
                className="justify-center text-center"
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function SelectTriggerElementDisabled(
  props: Omit<MultiSelectProps, 'title' | 'onSelectionChange' | 'search' | 'setSearch' | 'searchApi' | 'onReset'>,
) {
  const { selectedValues, options, placeholder } = props;

  return (
    <div className="flex min-h-11 grow-0 flex-wrap items-center gap-1 rounded-md border bg-[#F3F4F6] p-2">
      {selectedValues.size > 0 ? (
        options
          .filter(option => selectedValues.has(option.value))
          .map(option => (
            <Badge
              variant="rfsCancelled"
              key={option.value}
              className="select-none whitespace-nowrap rounded bg-slate-400 px-2 font-semibold"
              aria-disabled
            >
              {option.label}
            </Badge>
          ))
      ) : (
        <div className="select-none text-slate-400">{placeholder ?? ''}</div>
      )}
    </div>
  );
}

interface SelectAllProps {
  onSelectionChange: (selectedValues: Set<string>) => void;
  selectedValues?: Set<string>;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}
function SelectAll({ onSelectionChange, selectedValues, options }: SelectAllProps) {
  const filtered = useCommandState(state => state.filtered);
  const newSelectedValues = new Set(selectedValues);
  return (
    <CommandItem
      onSelect={() => {
        const items: Map<string, number> = filtered.items;
        Array.from(items.values()).forEach((value, index) => {
          if (!value || !options[index]) return;

          newSelectedValues.add(options[index].value);
        });
        onSelectionChange(newSelectedValues);
      }}
      className="justify-center text-center"
      value="select-shown"
    >
      Select shown
    </CommandItem>
  );
}
