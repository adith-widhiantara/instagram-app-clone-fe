import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './form';
import { RequiredAsterisk } from './required-asterisk';

interface FieldSelectProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label?: string;
  options: { value: string; label: string }[];
  isDisabled?: boolean;
  hasRequiredAsterisk?: boolean;
  title?: string;
}
export function FieldSelect<TFormValues extends FieldValues>({
  name,
  label,
  options,
  isDisabled = false,
  hasRequiredAsterisk = false,
  title = 'Select an option',
}: FieldSelectProps<TFormValues>) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          {hasRequiredAsterisk && <RequiredAsterisk />}
          <Select onValueChange={field.onChange} value={field.value} disabled={isDisabled}>
            <FormControl>
              <SelectTrigger title={title}>
                {options?.find(option => JSON.stringify(option.value) === JSON.stringify(field.value))?.label ??
                  'Select...'}
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
