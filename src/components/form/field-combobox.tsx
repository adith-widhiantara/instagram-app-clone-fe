import { LucideCheck, LucideChevronsUpDown, LucideX } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';
import { RequiredAsterisk } from './required-asterisk';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { Loading } from '../ui/loading';

const popOverSizeMap = {
  sm: 'w-60',
  md: 'w-72',
  lg: 'w-96',
};

interface FieldComboboxProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  hideLabel?: boolean;
  options: {
    value: TFormValues[keyof TFormValues];
    label: string;
  }[];
  search: string;
  onClear?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setSearch: (value: string) => void;
  onSelect?: (option: { value: TFormValues[keyof TFormValues]; label: string }) => void;
  isDisabled?: boolean;
  hasRequiredAsterisk?: boolean;
  description?: React.ReactNode;
  placeholder?: string;
  loading?: boolean;
  popOverSize?: 'sm' | 'md' | 'lg';
  searchApi?: boolean;
}
export function FieldCombobox<TFormValues extends FieldValues>({
  name,
  label,
  hideLabel,
  options,
  isDisabled = false,
  hasRequiredAsterisk = false,
  search,
  setSearch,
  onSelect,
  onClear,
  description,
  placeholder,
  popOverSize = 'md',
  loading = false,
  searchApi = false,
}: Readonly<FieldComboboxProps<TFormValues>>) {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState<number>(+new Date());
  const form = useFormContext();
  const currentValue = form.watch(name);

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

  function handleClear(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    // @ts-expect-error undefined now allowed
    form.setValue(name, undefined);
    onClear?.(e);
    setKey(+new Date());
  }

  const handleInputChange = debounce(value => {
    setSearch(value);
  }, 500);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full break-inside-avoid-column">
          <FormLabel className={hideLabel ? 'sr-only' : undefined}>{label}</FormLabel>
          {hasRequiredAsterisk && <RequiredAsterisk />}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <button
                  key={key}
                  disabled={isDisabled}
                  data-testid={name}
                  className="text-black disabled:text-black relative flex h-11 w-full items-center gap-x-2 rounded-md border bg-white text-sm disabled:border-[#E1E1E1] disabled:bg-[#F3F4F6] disabled:!opacity-100 dark:bg-neutral-50"
                  title="Search"
                  onClick={() => setSearch('')}
                >
                  <LucideChevronsUpDown className="ml-2" />
                  <span className="truncate text-left">
                    {options?.find(option => JSON.stringify(option.value) === JSON.stringify(field.value))?.label ??
                      (placeholder ? <span className="text-slate-400">{placeholder}</span> : '')}
                  </span>
                  {!isDisabled && currentValue && (
                    <button
                      data-testid={'combobox-clear-button-' + name}
                      type="button"
                      className="absolute right-2 top-3 z-50 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
                      onClick={e => handleClear(e)}
                    >
                      <LucideX size={14} />
                    </button>
                  )}
                </button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent align="start" className={`${popOverSizeMap[popOverSize]}`}>
              <Command>
                {!searchApi && (
                  <CommandInput
                    placeholder="Search..."
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSearch(e.target.value);
                    }}
                  />
                )}

                {searchApi && (
                  <input
                    className="border-b p-2 text-sm focus:outline-none"
                    placeholder="Search..."
                    onChange={e => {
                      handleInputChange(e.target.value);
                    }}
                  />
                )}
                {search?.length && !loading ? <CommandEmpty>No data found.</CommandEmpty> : null}
                {loading && <Loading />}
                <CommandGroup className="text-black max-h-48 w-full overflow-y-scroll">
                  {options?.map(option => (
                    <CommandItem
                      key={option.value}
                      value={`${option.label}`}
                      onSelect={() => {
                        form.setValue(name, option.value);
                        onSelect?.(option);
                        setIsOpen(false);
                      }}
                      className={`${
                        JSON.stringify(option.value) === JSON.stringify(field.value)
                          ? 'bg-slate-100 text-main-blue-alurkerja'
                          : ''
                      }`}
                    >
                      {`${option.label}`}
                      <LucideCheck
                        size={18}
                        className={`ml-auto mr-4 text-main-blue-alurkerja ${
                          JSON.stringify(option.value) === JSON.stringify(field.value) ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
