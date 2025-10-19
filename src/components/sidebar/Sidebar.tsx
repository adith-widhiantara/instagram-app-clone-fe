import { Dispatch, FC, SetStateAction } from 'react';
import { MenuConfig, Sidebar } from 'alurkerja-ui';
import { useLocation } from 'react-router-dom';
import { menuConfig } from '@/components/sidebar/menuConfig';

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
  return (
    <div className="fixed">
      <Sidebar
        logo={<span className="font-bold text-white">Instagram Clone</span>}
        toggled={toggled}
        setToggled={setToggled}
        menuConfig={menuConfig}
        currentPathName={pathname}
        menuWrapper={menuWrapper}
      />
    </div>
  );
};
