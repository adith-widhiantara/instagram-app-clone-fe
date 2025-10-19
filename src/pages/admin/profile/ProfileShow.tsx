import { useGetProfile } from '@/api/profile';
import { FieldInput } from '@/components/form/field-input';
import { FormContainer } from '@/components/form/form-container';
import { VerticalGaps } from '@/components/ui/container';
import { H3 } from '@/components/ui/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'alurkerja-ui';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import z from 'zod';

const formSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  client: z.string().min(1, 'Client is required'),
  status: z.string(),
});

type ProfileFormValues = z.infer<typeof formSchema>;

const ProfileShow = () => {
  const { data, isLoading } = useGetProfile();
  const navigate = useNavigate();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
      client: '',
      status: '',
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        email: data.data.email ?? '',
        name: data.data.full_name ?? '',
        client: data.data.master_client?.client_name ?? '',
        status: data.data.status ? 'Active' : 'Inactive',
      });
    }
  }, [data, form]);

  return (
    <section className="w-1/2 min-w-[500px] rounded-xl bg-white p-6">
      <VerticalGaps>
        <H3>User Data Details</H3>
        <FormContainer form={form} className="flex flex-col gap-y-6">
          <VerticalGaps className="gap-y-3">
            <FieldInput label="Name" name="name" type="text" isDisabled />
            <FieldInput label="Email" name="email" type="text" isDisabled />
            <FieldInput label="Client" name="client" type="text" isDisabled />
            <FieldInput label="Status" name="status" type="text" isDisabled />
          </VerticalGaps>

          <div className="flex flex-row items-center justify-between">
            <div>
              <Button variant="outlined" isBlock={false} onClick={() => navigate('/')}>
                Back
              </Button>
            </div>
            <div>
              <Button isBlock={false} loading={isLoading} onClick={() => navigate('edit')}>
                Edit Profile
              </Button>
            </div>
          </div>
        </FormContainer>
      </VerticalGaps>
    </section>
  );
};

export default ProfileShow;
