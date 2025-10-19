import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Button, StatusIcon } from 'alurkerja-ui';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '@/api/auth';
import { FormContainer } from '@/components/form/form-container';
import { FieldInput } from '@/components/form/field-input';
import { useAuthStore } from '@/stores/auth.store';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { IUser } from '@/utils/types';

const formSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
});
type LoginFormValues = z.infer<typeof formSchema>;

const Login = () => {
  const { mutate, isPending: isLoading } = useLogin();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { setToken, setCurrentUser } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: FieldValues) => {
    mutate(
      { email: data.email, password: data.password },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: (response: any) => {
          const { data } = response;

          const userData: IUser = {
            id: data?.data?.user?.id,
            email: data?.data?.user?.email,
            name: data?.data?.user?.name,
          };

          // Handle successful login
          setToken(data?.data?.token);
          setCurrentUser(userData);
          navigate('/');
        },
        onError: error => {
          // Handle login error
          if (error?.response?.status === 422) {
            setErrorMessage(error?.response?.data?.message);
            return;
          }
          setErrorMessage('Login failed.');
        },
      },
    );
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center lg:px-0">
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 p-6">
        <FormContainer
          form={form}
          onSubmit={onSubmit}
          className="flex w-fit flex-col justify-center space-y-6 rounded-lg bg-white p-6 shadow sm:w-[450px]"
        >
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Instagram Login</h1>
            {errorMessage && (
              <div className={'flex items-center gap-1 rounded bg-red-50 px-4 py-2 shadow'} data-testid="alert-popup">
                <StatusIcon type="danger" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <FieldInput label="Email" name="email" type="text" hasRequiredAsterisk />
            <FieldInput label="Password" name="password" type="password" hasRequiredAsterisk />
            <div className="flex justify-end">
              <Link
                className=" text-sm text-main-blue-alurkerja hover:text-main-blue-alurkerja-hovered"
                to="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-2">
            <Button isBlock={false} loading={isLoading} data-testid="button-login">
              Login
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default Login;
