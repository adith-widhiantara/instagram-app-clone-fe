import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { setMockAuthState } from '@/test/setup';
import type { IUser } from '@/utils/types';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: vi.fn(({ children, to, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    )),
    Outlet: vi.fn(() => <div data-testid="outlet">Outlet Content</div>),
  };
});

// Mock alurkerja-ui Header component
vi.mock('alurkerja-ui', () => ({
  Header: vi.fn(({ showNotification, role, avatarContent }) => (
    <div data-testid="header">
      <span data-testid="header-role">{role}</span>
      <span data-testid="header-notification">{showNotification ? 'true' : 'false'}</span>
      <div data-testid="header-avatar">{avatarContent}</div>
    </div>
  )),
}));

// Mock ExtendedSidebar component
vi.mock('@/components/sidebar/Sidebar', () => {
  const mockExtendedSidebar = vi.fn(({ toggled, setToggled, menuWrapper }) => {
    // Test the MenuWrapper function by calling it with mock data
    const mockMenu = { href: '/test-route', label: 'Test Menu' };
    const menuWrapperResult = menuWrapper
      ? menuWrapper({
        children: <span>Test Child</span>,
        menu: mockMenu,
      })
      : null;

    return (
      <div data-testid="sidebar">
        <span data-testid="sidebar-toggled">{toggled ? 'true' : 'false'}</span>
        <button data-testid="sidebar-toggle" onClick={() => setToggled(!toggled)}>
          Toggle
        </button>
        <div data-testid="sidebar-menu-wrapper">{menuWrapper ? 'Menu Wrapper Present' : 'No Menu Wrapper'}</div>
        <div data-testid="menu-wrapper-result">{menuWrapperResult}</div>
      </div>
    );
  });

  return {
    ExtendedSidebar: mockExtendedSidebar,
  };
});

// Mock AvatarContent component
vi.mock('./AvatarContent', () => ({
  default: vi.fn(() => <div data-testid="avatar-content">Avatar Content</div>),
}));

// Mock cn utility with spy
vi.mock('@/utils/helpers/cn', () => ({
  cn: vi.fn((...args) => args.filter(Boolean).join(' ')),
}));

const renderAdminLayout = () => {
  return render(
    <BrowserRouter>
      <AdminLayout />
    </BrowserRouter>,
  );
};

describe('AdminLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render all main components', () => {
      setMockAuthState({ currentUser: undefined });

      renderAdminLayout();

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('outlet')).toBeInTheDocument();
      expect(screen.getByTestId('avatar-content')).toBeInTheDocument();
    });

    it('should render with proper structure', () => {
      setMockAuthState({ currentUser: undefined });

      renderAdminLayout();

      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
      expect(mainElement).toHaveClass('px-4', 'py-8');
    });
  });

  describe('User State Display', () => {
    it('should display user full name when currentUser exists', () => {
      const mockUser: IUser = {
        id: 1,
        email: 'test@example.com',
        name: 'John Doe',
      };

      setMockAuthState({ currentUser: mockUser });

      renderAdminLayout();

      expect(screen.getByTestId('header-role')).toHaveTextContent('John Doe');
    });

    it('should display Admin when currentUser is undefined', () => {
      setMockAuthState({ currentUser: undefined });

      renderAdminLayout();

      expect(screen.getByTestId('header-role')).toHaveTextContent('Admin');
    });

    it('should display empty string when currentUser full_name is empty', () => {
      const mockUser: IUser = {
        id: 1,
        email: 'test@example.com',
        name: '',
      };

      setMockAuthState({ currentUser: mockUser });

      renderAdminLayout();

      expect(screen.getByTestId('header-role')).toHaveTextContent('');
    });

    it('should handle undefined full_name property and fall back to Admin', () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        // Omit full_name to test undefined case
        email_verified_at: new Date('2023-01-01'),
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
        master_client: {
          id: '1',
          client_name: 'Test Client',
          description: 'Test Description',
          blasting_quota: 100,
          status: true,
          created_by: null,
          updated_by: null,
          deleted_by: null,
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
          deleted_at: null,
        },
      } as Partial<IUser> as IUser;

      setMockAuthState({ currentUser: mockUser });

      renderAdminLayout();

      expect(screen.getByTestId('header-role')).toHaveTextContent('Admin');
    });
  });

  describe('Header Configuration', () => {
    it('should configure header with showNotification as false', () => {
      setMockAuthState({ currentUser: undefined });

      renderAdminLayout();

      expect(screen.getByTestId('header-notification')).toHaveTextContent('false');
    });

    it('should pass AvatarContent to header', () => {
      setMockAuthState({ currentUser: undefined });

      renderAdminLayout();

      expect(screen.getByTestId('header-avatar')).toContainElement(screen.getByTestId('avatar-content'));
    });
  });

  describe('Sidebar Functionality', () => {
    it('should initialize sidebar with toggled as false', () => {
      setMockAuthState({ currentUser: undefined });

      renderAdminLayout();

      expect(screen.getByTestId('sidebar-toggled')).toHaveTextContent('false');
    });

    it('should pass menuWrapper to sidebar', () => {
      setMockAuthState({ currentUser: undefined });

      renderAdminLayout();

      expect(screen.getByTestId('sidebar-menu-wrapper')).toHaveTextContent('Menu Wrapper Present');
    });

    it('should toggle sidebar state when toggle button is clicked', async () => {
      const user = userEvent.setup();
      setMockAuthState({ currentUser: undefined });

      renderAdminLayout();

      const toggleButton = screen.getByTestId('sidebar-toggle');
      const toggledDisplay = screen.getByTestId('sidebar-toggled');

      expect(toggledDisplay).toHaveTextContent('false');

      await user.click(toggleButton);
      expect(toggledDisplay).toHaveTextContent('true');

      await user.click(toggleButton);
      expect(toggledDisplay).toHaveTextContent('false');
    });
  });

  describe('Layout Responsiveness', () => {
    it('should render layout container with proper structure', () => {
      setMockAuthState({ currentUser: undefined });

      renderAdminLayout();

      // Check that the main content area exists
      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();

      // Check that sidebar and header are present
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should handle sidebar toggle functionality', async () => {
      const user = userEvent.setup();
      setMockAuthState({ currentUser: undefined });

      renderAdminLayout();

      const toggleButton = screen.getByTestId('sidebar-toggle');
      const toggledDisplay = screen.getByTestId('sidebar-toggled');

      expect(toggledDisplay).toHaveTextContent('false');

      await user.click(toggleButton);
      expect(toggledDisplay).toHaveTextContent('true');

      await user.click(toggleButton);
      expect(toggledDisplay).toHaveTextContent('false');
    });
  });

  describe('MenuWrapper Function', () => {
    it('should create proper Link components when MenuWrapper is called', () => {
      setMockAuthState({ currentUser: undefined });

      renderAdminLayout();

      // The MenuWrapper is passed to ExtendedSidebar and gets called within the mock
      expect(screen.getByTestId('sidebar-menu-wrapper')).toHaveTextContent('Menu Wrapper Present');

      // Verify the MenuWrapper result is rendered
      const menuWrapperResult = screen.getByTestId('menu-wrapper-result');
      expect(menuWrapperResult).toBeInTheDocument();
    });

    it('should verify MenuWrapper function creates Link with correct props', async () => {
      setMockAuthState({ currentUser: undefined });

      renderAdminLayout();

      // The mock ExtendedSidebar calls menuWrapper internally
      // We can verify it was called by checking the result
      expect(screen.getByTestId('menu-wrapper-result')).toBeInTheDocument();

      // Verify Link component was called with correct props
      const { Link } = vi.mocked(await import('react-router-dom'));
      expect(Link).toHaveBeenCalledWith(
        expect.objectContaining({
          to: '/test-route',
          children: expect.anything(),
        }),
        expect.anything(),
      );
    });
  });

  describe('Component Integration', () => {
    it('should render with all required props passed to child components', () => {
      const mockUser: IUser = {
        id: 1,
        email: 'admin@example.com',
        name: 'Admin User',
      };

      setMockAuthState({ currentUser: mockUser });

      renderAdminLayout();

      // Verify all components are rendered with proper data
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('header-role')).toHaveTextContent('Admin User');
      expect(screen.getByTestId('header-notification')).toHaveTextContent('false');
      expect(screen.getByTestId('avatar-content')).toBeInTheDocument();
      expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });

    it('should handle state changes correctly when toggling sidebar multiple times', async () => {
      const user = userEvent.setup();
      setMockAuthState({ currentUser: undefined });

      renderAdminLayout();

      const toggleButton = screen.getByTestId('sidebar-toggle');
      const toggledDisplay = screen.getByTestId('sidebar-toggled');

      // Initial state
      expect(toggledDisplay).toHaveTextContent('false');

      // Toggle to true
      await user.click(toggleButton);
      expect(toggledDisplay).toHaveTextContent('true');

      // Toggle back to false
      await user.click(toggleButton);
      expect(toggledDisplay).toHaveTextContent('false');

      // Toggle to true again
      await user.click(toggleButton);
      expect(toggledDisplay).toHaveTextContent('true');
    });
  });
});
