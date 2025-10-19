import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Header, MenuConfig } from 'alurkerja-ui';
import { ExtendedSidebar } from '@/components/sidebar/Sidebar';
import { useAuthStore } from '@/stores/auth.store';
import AvatarContent from './AvatarContent';
import { cn } from '@/utils/helpers/cn';

const MenuWrapper = (props: { children: JSX.Element; menu: MenuConfig }) => {
  const { children, menu } = props;
  return <Link to={menu.href}>{children}</Link>;
};

export function AdminLayout() {
  const { currentUser } = useAuthStore();
  const [toggled, setToggled] = useState(false);

  return (
    <div className="max-w-screen">
      <ExtendedSidebar toggled={toggled} setToggled={setToggled} menuWrapper={MenuWrapper} />

      <div className={cn('duration-400 transition-[margin] ease-in-out', toggled ? 'sm:ml-[80px]' : 'sm:ml-[270px]')}>
        <Header showNotification={false} role={currentUser?.name ?? 'Admin'} avatarContent={<AvatarContent />} />
        <main className="px-4 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
