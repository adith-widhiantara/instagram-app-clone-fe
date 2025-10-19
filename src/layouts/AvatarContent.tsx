import { useLogout } from '@/api/auth';
import { H5, P } from '@/components/ui/typography';
import { useAuthStore } from '@/stores/auth.store';
import { usePermissionStore } from '@/stores/permission.store';
import { swalDelete } from '@/utils/lib/swal';
import { LogOut, User2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AvatarContent() {
  const navigate = useNavigate();
  const { resetToken, resetCurrentUser, currentUser, resetRole } = useAuthStore();
  const { resetPermissions } = usePermissionStore();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    swalDelete
      .fire({
        title: 'Are you sure?',
        text: 'You will be logged out from your account.',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'No, cancel',
      })
      .then(result => {
        if (result.isConfirmed) {
          logout(undefined, {
            onSuccess: () => {
              resetPermissions();
              resetRole();
              resetCurrentUser();
              resetToken();
              navigate('/login');
            },
            onError: error => {
              console.error('Logout error:', error);
            },
          });
        }
      });
  };

  return (
    <div className="w-full">
      <div className="border-b p-3">
        <H5>{currentUser?.name}</H5>
        <P>{currentUser?.email}</P>
      </div>
      <button
        type="button"
        className="flex w-full cursor-pointer items-center gap-1 px-4 py-2 hover:bg-light-blue-alurkerja hover:text-main-blue-alurkerja"
        onClick={() => {
          navigate('/admin/profile');
        }}
      >
        <User2 size={18} /> Profile
      </button>
      <button
        type="button"
        className="flex w-full cursor-pointer items-center gap-1 px-4 py-2 hover:bg-light-blue-alurkerja hover:text-main-blue-alurkerja"
        disabled={isPending}
        onClick={handleLogout}
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}
