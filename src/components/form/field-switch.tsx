import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';
import { RequiredAsterisk } from './required-asterisk';
import { Toogle } from 'alurkerja-ui';

interface FieldSwitchProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  isDisabled?: boolean;
  hasRequiredAsterisk?: boolean;
  description?: React.ReactNode;
}
export function FieldSwitch<TFormValues extends FieldValues>({
  name,
  label,
  isDisabled = false,
  hasRequiredAsterisk = false,
  description,
}: FieldSwitchProps<TFormValues>) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={'flex break-inside-avoid-column flex-col'}>
          <FormLabel className="text-base">{label}</FormLabel>
          {hasRequiredAsterisk && <RequiredAsterisk />}
          <FormControl>
            <Toogle
              name={field.name}
              defaultValue={field.value}
              onChange={value => {
                field.onChange(value);
              }}
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
