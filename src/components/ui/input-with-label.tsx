import { Input } from "alurkerja-ui";
import { Label } from "./label";
import { useId } from "react";
import { RequiredAsterisk } from "../form/required-asterisk";

interface InputWithLabelProps {
  label: string;
  value?: string | number;
  isDisabled?: boolean;
  hasRequiredAsterisk?: boolean;
  name?: string;
}
export function InputWithLabel({
  label,
  value,
  isDisabled,
  hasRequiredAsterisk,
  name,
}: InputWithLabelProps) {
  const id = useId();
  return (
    <div className="break-inside-avoid-column space-y-2">
      <Label htmlFor={id} className="dark:text-neutral-300">
        {label}
      </Label>
      {hasRequiredAsterisk && <RequiredAsterisk />}
      <Input name={name} id={id} value={value} disabled={isDisabled} />
    </div>
  );
}
