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
import UserListCard from '@/features/features/people/components/UserListCard';
import { useAddUnfollowUser } from '@/api/people';

const formSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
});

type ProfileFormValues = z.infer<typeof formSchema>;

const ProfileShow = () => {
  const { data } = useGetProfile();
  const navigate = useNavigate();

  const {
    mutate,
  } = useAddUnfollowUser();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
    },
  });

  const handleUserAction = (userId: any, actionType: any) => {
    if (actionType === 'unfollow') {
      mutate({
        user_id: userId,
      });
    }
  };

  useEffect(() => {
    if (data) {
      form.reset({
        email: data.data.user.email ?? '',
        name: data.data.user.name ?? '',
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
          </VerticalGaps>

          <div className="flex flex-row items-center justify-between">
            <div>
              <Button variant="outlined" isBlock={false} onClick={() => navigate('/')}>
                Back
              </Button>
            </div>
          </div>
        </FormContainer>
      </VerticalGaps>

      {data && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '50px' }}>
          {/* Card Followers */}
          <UserListCard
            title="Followers Anda"
            users={data.data.user.followers}
            type="followers"
            onAction={handleUserAction}
          />

          {/* Card Following */}
          <UserListCard
            title="Mengikuti"
            users={data.data.user.following}
            type="following"
            onAction={handleUserAction}
          />
        </div>
      )}
    </section>
  );
};

export default ProfileShow;
