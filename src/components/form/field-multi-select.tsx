import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './form';
import { RequiredAsterisk } from './required-asterisk';
import { MultiSelect } from '../ui/multi-select';

interface FieldMultiSelectProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  hideLabel?: boolean;
  options: { value: string; label: string }[];
  isDisabled?: boolean;
  hasRequiredAsterisk?: boolean;
  placeholder?: string;
  search: string;
  onReset?: () => void;
  onChange?: (selectedValues: string[]) => void;
  setSearch: (value: string) => void;
  searchApi?: boolean;
}
export function FieldMultiSelect<TFormValues extends FieldValues>({
  name,
  label,
  hideLabel = false,
  options,
  isDisabled = false,
  hasRequiredAsterisk = false,
  placeholder,
  search,
  onChange: handleChange,
  onReset,
  setSearch,
  searchApi,
}: Readonly<FieldMultiSelectProps<TFormValues>>) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={`${hideLabel ? 'sr-only' : undefined}`}>{label}</FormLabel>
          {hasRequiredAsterisk && <RequiredAsterisk />}
          <FormControl>
            <MultiSelect
              placeholder={placeholder}
              options={options}
              selectedValues={new Set(field.value)}
              onSelectionChange={selectedValues => {
                field.onChange(Array.from(selectedValues));
                handleChange?.(Array.from(selectedValues));
              }}
              search={search}
              setSearch={setSearch}
              searchApi={searchApi}
              onReset={() => {
                field.onChange([]);
                handleChange?.([]);
                onReset?.();
              }}
              isDisabled={isDisabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
