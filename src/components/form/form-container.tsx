import { FieldValues, UseFormReturn } from "react-hook-form";
import { Form } from "./form";

interface FormContainerProps<TFormValues extends FieldValues> {
  children: React.ReactNode;
  form: UseFormReturn<TFormValues>;
  id?: string;
  onSubmit?: (values: TFormValues) => void;
  onSubmitError?: (error: unknown) => void;
  className?: string;
}
export function FormContainer<TFormValues extends FieldValues>({
  children,
  form,
  id,
  onSubmit,
  onSubmitError,
  className,
}: FormContainerProps<TFormValues>) {
  function handleSubmit(values: TFormValues) {
    onSubmit?.(values);
  }
  return (
    <Form {...form}>
      <form
        id={id}
        onSubmit={form.handleSubmit(handleSubmit, onSubmitError)}
        className={className ?? "flex w-full flex-col gap-y-4"}
      >
        {children}
      </form>
    </Form>
  );
}

/*
  Only to be used inside FormContainer.
  The number of columns is calculated based on
  the minimum width of the children,
  the maximum width of the FormContainer,
  and the gaps.
*/
export function FieldsetThreeColumn({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <fieldset className="grid grid-cols-[repeat(auto-fit,_minmax(17rem,_1fr))] gap-4 border p-4">
      {children}
    </fieldset>
  );
}

export function Legend({ children }: { children: React.ReactNode }) {
  return <legend className="p-2 text-sm font-medium">{children}</legend>;
}
