import { Dispatch, FC, SetStateAction } from 'react';
import { MenuConfig, Sidebar } from 'alurkerja-ui';
import { useLocation } from 'react-router-dom';
import { useVisibleMenu } from '@/utils/hooks/useVisibleMenu';

interface MenuWrapperProps {
  children: JSX.Element;
  menu: MenuConfig;
}

interface ExtendedSidebarProps {
  toggled: boolean;
  setToggled: Dispatch<SetStateAction<boolean>>;
  menuWrapper: (props: MenuWrapperProps) => JSX.Element;
}

export const ExtendedSidebar: FC<ExtendedSidebarProps> = ({ setToggled, toggled, menuWrapper }) => {
  const { pathname } = useLocation();
  const menus = useVisibleMenu();

  return (
    <div className="fixed">
      <Sidebar
        logo={<span className="font-bold text-white">Instagram Clone</span>}
        toggled={toggled}
        setToggled={setToggled}
        menuConfig={menus}
        currentPathName={pathname}
        menuWrapper={menuWrapper}
      />
    </div>
  );
};
