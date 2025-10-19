import { useContext } from "react";
import { useFormContext } from "react-hook-form";

interface FormFieldContext {
  name: string;
}

interface FormItemContext {
  id: string;
}

const useFormField = ({
  formFieldContext,
  formItemContext,
}: {
  formFieldContext: React.Context<FormFieldContext>;
  formItemContext: React.Context<FormItemContext>;
}) => {
  const FormFieldContext = formFieldContext;
  const FormItemContext = formItemContext;
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

export { useFormField };
