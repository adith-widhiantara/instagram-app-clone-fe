import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Input } from 'alurkerja-ui';
import { RequiredAsterisk } from './required-asterisk';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/helpers/cn';

interface FieldInputProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label?: string;
  hideLabel?: boolean;
  placeholder?: string;
  description?: string;
  type?: 'text' | 'number' | 'file' | 'password' | 'email';
  accept?: string;
  isDisabled?: boolean;
  isVisuallyHidden?: boolean;
  hasRequiredAsterisk?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  title?: string;
  min?: number;
  transform?: (e: React.ChangeEvent<HTMLInputElement>) => React.ChangeEvent<HTMLInputElement>;
  uppercase?: boolean;
}
export function FieldInput<TFormValues extends FieldValues>({
  name,
  label,
  hideLabel,
  placeholder,
  description,
  type = 'text',
  accept,
  isDisabled = false,
  isVisuallyHidden = false,
  hasRequiredAsterisk = false,
  onChange,
  onKeyDown,
  title,
  min,
  transform,
  uppercase = false,
}: FieldInputProps<TFormValues>) {
  const handleChange = onChange;
  const form = useFormContext();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [typeState, setTypeState] = useState(type);

  const handleUppercaseTransform = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uppercase && type === 'text') {
      const newEvent = { ...e };
      newEvent.target = {
        ...e.target,
        value: e.target.value.toUpperCase(),
      };
      return newEvent as React.ChangeEvent<HTMLInputElement>;
    }

    return e;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, ...fieldProps } }) => (
        <FormItem
          className={`${isVisuallyHidden ? 'sr-only' : 'break-inside-avoid-column'}${hideLabel ? ' space-y-0' : ''}`}
        >
          {label && (
            <FormLabel htmlFor={fieldProps.name} className={hideLabel ? 'sr-only' : ''}>
              {label}
            </FormLabel>
          )}
          {hasRequiredAsterisk && <RequiredAsterisk />}
          <FormControl>
            {type === 'file' ? (
              <Input
                id={fieldProps.name}
                name={fieldProps.name}
                type="file"
                accept={accept}
                disabled={isDisabled}
                onChange={e => {
                  onChange(e.target.files?.[0]);
                  handleChange?.(e);
                }}
                className="dark:bg-neutral-50"
                title={title}
              />
            ) : (
              <div
                className={cn({
                  'text-black pointer-events-none flex items-center justify-center rounded-md border text-base focus-within:border-main-blue-alurkerja focus-within:ring-1 focus-within:ring-main-blue-alurkerja focus:border-main-blue-alurkerja focus:ring-1 focus:ring-main-blue-alurkerja':
                    type === 'password',
                })}
              >
                <Input
                  {...fieldProps}
                  id={fieldProps.name}
                  onChange={e => {
                    const processedEvent = handleUppercaseTransform(e);
                    const finalEvent = transform ? transform(processedEvent) : processedEvent;
                    onChange(finalEvent);

                    handleChange?.(finalEvent);
                  }}
                  type={type === 'password' ? typeState : type}
                  disabled={isDisabled}
                  placeholder={placeholder}
                  title={title}
                  onKeyDown={onKeyDown}
                  min={min}
                  className={cn('text-black', {
                    'pointer-events-auto border-none focus-within:border-none focus-within:ring-0 focus:border-none focus:ring-0':
                      type === 'password',
                  })}
                />
                {type === 'password' && (
                  <div className="">
                    <button
                      className="!text-black pointer-events-auto p-2"
                      type="button"
                      onClick={() => {
                        setIsPasswordVisible(prev => {
                          setTypeState(!prev ? 'text' : 'password');
                          return !prev;
                        });
                      }}
                    >
                      {isPasswordVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                )}
              </div>
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
