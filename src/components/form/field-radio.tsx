import { FieldValues, Path, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { RequiredAsterisk } from "./required-asterisk";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface FieldRadioProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  options: {
    value: TFormValues[keyof TFormValues];
    label: string;
  }[];
  isDisabled?: boolean;
  hasRequiredAsterisk?: boolean;
  description?: React.ReactNode;
}
export function FieldRadio<TFormValues extends FieldValues>({
  name,
  label,
  options,
  isDisabled = false,
  hasRequiredAsterisk = false,
  description,
}: FieldRadioProps<TFormValues>) {
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
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {options.map((option) => (
                <FormItem
                  key={option.value}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem
                      value={option.value}
                      disabled={isDisabled}
                      className="text-red-950 dark:bg-neutral-50"
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
