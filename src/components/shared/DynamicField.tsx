import { Input } from 'alurkerja-ui';
import { UseFormReturn } from 'react-hook-form';
import { FormContainer } from '../form/form-container';
import { FieldInput } from '../form/field-input';
import { FieldSelect } from '../form/field-select';

export interface DynamicFieldSpec {
  id: string;
  field_name: string;
  field_type: string;
  required: boolean;
  value?: string;
}

interface DynamicFieldProps {
  spec: DynamicFieldSpec[];
  form: UseFormReturn;
  disabled?: boolean;
}
export const DynamicField: React.FC<DynamicFieldProps> = ({ spec, form, disabled = false }) => {
  const DynamicInputField = ({ field }: { field: DynamicFieldSpec }) => {
    if (field.field_type.toLowerCase() === 'boolean') {
      return (
        <FieldSelect
          name={field.id}
          options={[
            { value: 'true', label: 'True' },
            { value: 'false', label: 'False' },
          ]}
        />
      );
    } else {
      return <FieldInput name={field.id} placeholder={field.required ? 'Required' : ''} isDisabled={disabled} />;
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <FormContainer form={form}>
        {spec.map((field: DynamicFieldSpec) => (
          <div key={field.id} className="grid grid-cols-3 gap-x-2">
            <Input value={field.field_name} disabled />
            <Input value={field.field_type} disabled />
            <DynamicInputField field={field} />
          </div>
        ))}
      </FormContainer>
    </div>
  );
};
