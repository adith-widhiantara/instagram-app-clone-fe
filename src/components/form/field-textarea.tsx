import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Textarea } from '../ui/textarea';
import { RequiredAsterisk } from './required-asterisk';

interface FieldTextareaProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  placeholder?: string;
  description?: string;
  isDisabled?: boolean;
  hasRequiredAsterisk?: boolean;
}
export function FieldTextarea<TFormValues extends FieldValues>({
  name,
  label,
  placeholder,
  description,
  isDisabled,
  hasRequiredAsterisk,
}: FieldTextareaProps<TFormValues>) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {hasRequiredAsterisk && <RequiredAsterisk />}
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className="text-black h-[15.625em] resize-none"
              {...field}
              disabled={isDisabled}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
