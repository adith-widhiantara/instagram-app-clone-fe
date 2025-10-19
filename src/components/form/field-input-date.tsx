import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';
import { InputDate } from 'alurkerja-ui';
import { RequiredAsterisk } from './required-asterisk';
import { LucideX } from 'lucide-react';

interface FieldInputDateProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  showTimeInput?: boolean;
  hideLabel?: boolean;
  description?: string;
  isVisuallyHidden?: boolean;
  hasRequiredAsterisk?: boolean;
  selectsStart?: boolean;
  selectsEnd?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  minDate?: Date | null;
  maxDate?: Date | null;
  disabled?: boolean;
  onChange?: (date?: Date | null) => void;
}

export function FieldInputDate<TFormValues extends FieldValues>({
  name,
  label,
  hideLabel,
  description,
  isVisuallyHidden = false,
  hasRequiredAsterisk = false,
  selectsEnd = false,
  selectsStart = false,
  startDate,
  endDate,
  minDate,
  maxDate,
  disabled = false,
  onChange,
  showTimeInput = false,
}: FieldInputDateProps<TFormValues>) {
  const handleChange = onChange;
  const form = useFormContext();
  const currentDateValue = form.watch(name);

  function handleClear() {
    // @ts-expect-error undefined value
    form.setValue(name, undefined);
    handleChange?.(undefined);
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, value, ...fieldProps } }) => (
        <FormItem
          className={`${isVisuallyHidden ? 'sr-only' : 'text-black relative w-full break-inside-avoid-column'} ${
            hideLabel ? ' space-y-0' : ''
          }`}
        >
          {label && <FormLabel className={hideLabel ? 'sr-only' : ''}>{label}</FormLabel>}
          {hasRequiredAsterisk && <RequiredAsterisk />}
          <FormControl>
            <InputDate
              {...fieldProps}
              ref={undefined}
              name={fieldProps.name}
              selected={value ? new Date(value) : null}
              selectsStart={selectsStart}
              selectsEnd={selectsEnd}
              startDate={startDate}
              endDate={endDate}
              minDate={minDate}
              maxDate={maxDate}
              disabled={disabled}
              onChange={date => {
                if (date) {
                  onChange(date);
                  handleChange?.(date);
                }
              }}
              dateFormat={showTimeInput ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
              timeFormat="HH:mm"
              className="relative h-11 w-full rounded border border-[#c4c4c480] px-3 py-2 focus-within:border-indigo-600 focus-within:ring-indigo-600 focus:border-indigo-600 focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-neutral-100"
              dropdownMode="select"
              timeIntervals={5}
              showTimeSelect={showTimeInput}
              strictParsing
              showMonthDropdown
              showYearDropdown
            />
          </FormControl>
          {!disabled && currentDateValue && (
            <button className="absolute right-12 top-9" onClick={handleClear}>
              <LucideX size={20} />
              <span className="sr-only">Clear date</span>
            </button>
          )}
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
