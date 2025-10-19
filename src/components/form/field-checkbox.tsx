import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';
import { RequiredAsterisk } from './required-asterisk';
import { Checkbox } from '../ui/checkbox';

interface FieldCheckboxProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label?: string;
  options: {
    value: TFormValues[keyof TFormValues];
    label: string;
  }[];
  hideLabel?: boolean;
  isDisabled?: boolean;
  hasRequiredAsterisk?: boolean;
  description?: React.ReactNode;
  containerClassName?: string;
  optionsDisable?: string[];
}
export function FieldCheckbox<TFormValues extends FieldValues>({
  name,
  label,
  options,
  hideLabel = false,
  isDisabled = false,
  hasRequiredAsterisk = false,
  description,
  containerClassName,
  optionsDisable = [],
}: FieldCheckboxProps<TFormValues>) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={`${hideLabel ? ' space-y-0' : ''}`}>
          <div className={`${hideLabel ? '' : 'mb-4'}`}>
            {label && <FormLabel className={hideLabel ? 'sr-only' : ''}>{label}</FormLabel>}
            {hasRequiredAsterisk && <RequiredAsterisk />}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </div>
          <div className={containerClassName ?? 'flex flex-col gap-y-2'}>
            {options.map(option => (
              <FormField
                key={option.label}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem key={option.label} className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        className="data-[state=checked]:bg-main-blue-alurkerja"
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={checked => {
                          const value = field.value ? field.value : [];
                          return checked
                            ? field.onChange([...value, option.value])
                            : field.onChange(value?.filter((v: string) => v !== option.value));
                        }}
                        disabled={isDisabled || optionsDisable?.includes(String(option.value))}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{option.label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </FormItem>
      )}
    />
  );
}
