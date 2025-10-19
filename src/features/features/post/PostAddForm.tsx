import { FieldInput } from '@/components/form/field-input';
import { FormContainer } from '@/components/form/form-container';
import { Gaps, VerticalGaps } from '@/components/ui/container';
import { Button } from 'alurkerja-ui';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { swalConfirm, swalSuccess } from '@/utils/lib/swal';
import { handleApiError } from '@/utils/helpers/handleError';
import { AddPostFormValues, formPayloadSchema } from './utils/formSchema';
import { useAddPost } from '@/api/post';
import FieldFileDropzone from '@/components/form/field-file-dropzone';

export default function PostAddForm() {
  const { mutate: addPost, isPending } = useAddPost();
  const navigate = useNavigate();

  const form = useForm<AddPostFormValues>({
    resolver: zodResolver(formPayloadSchema),
  });

  const handleSubmit = (data: AddPostFormValues) => {
    swalConfirm
      .fire({
        text: 'Are you sure you want to create new Post?',
      })
      .then(result => {
        if (result.isConfirmed) {
          const payload = { ...data };
          addPost(payload, { onSuccess: onSuccess, onError: (error: any) => handleApiError(error) });
        }
      });
  };

  const onSuccess = () => {
    swalSuccess
      .fire({
        text: 'Post Setting added successfully!',
      })
      .then(() => {
        navigate('/');
        form.reset();
      });
  };

  return (
    <FormContainer form={form} onSubmit={handleSubmit} className="flex flex-col gap-y-9">
      <Gaps>
        <VerticalGaps className="grow">
          <FieldFileDropzone name="image" label="Upload Image" accept={'image'} hideLabel />

          <FieldInput label="Caption" name="caption" type="text" hasRequiredAsterisk />

          <div className="mt-4 flex flex-row items-center justify-between">
            <div>
              <Button variant="outlined" isBlock={false} onClick={() => navigate('/')}>
                Back
              </Button>
            </div>
            <div className="flex gap-x-1">

              <Button isBlock={false} type="submit" loading={isPending}>
                Submit
              </Button>
            </div>
          </div>
        </VerticalGaps>
      </Gaps>
    </FormContainer>
  );
}
