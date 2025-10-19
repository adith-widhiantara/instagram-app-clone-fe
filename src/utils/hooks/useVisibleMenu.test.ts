import { describe, test, expect, beforeEach, vi, Mock } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useVisibleMenu } from './useVisibleMenu';
import { usePermissionStore } from '@/stores/permission.store';
import { filterMenuByPermissions } from '../helpers/filterMenuByPermissions';
import { cleanMenuForLibrary } from '../helpers/cleanMenuForLibrary';
import { menuConfig, AppMenuConfig } from '@/components/sidebar/menuConfig';

// Define types for better type safety
type PermissionStoreState = {
  can: (permissions: string | string[], operator?: 'AND' | 'OR') => boolean;
};

// Mock dependencies
vi.mock('@/stores/permission.store');
vi.mock('../helpers/filterMenuByPermissions');
vi.mock('../helpers/cleanMenuForLibrary');
vi.mock('@/components/sidebar/menuConfig', () => ({
  menuConfig: [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/master',
      label: 'Master',
      child: [
        {
          href: '/master/clients',
          label: 'Clients',
          permission: 'clients.index',
        },
        {
          href: '/master/users',
          label: 'Users',
          permission: 'users.index',
        },
      ],
    },
    {
      href: '/admin',
      label: 'Admin',
      permission: 'admin.access',
    },
  ] as AppMenuConfig[],
}));

describe('useVisibleMenu', () => {
  const mockCan = vi.fn();
  const mockFilterMenuByPermissions = filterMenuByPermissions as Mock;
  const mockCleanMenuForLibrary = cleanMenuForLibrary as Mock;
  const mockUsePermissionStore = usePermissionStore as unknown as Mock;

  const filteredMenuMock: AppMenuConfig[] = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/master',
      label: 'Master',
      child: [
        {
          href: '/master/clients',
          label: 'Clients',
          permission: 'clients.index',
        },
      ],
    },
  ];

  const cleanedMenuMock = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/master',
      label: 'Master',
      child: [
        {
          href: '/master/clients',
          label: 'Clients',
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock usePermissionStore to return the can function
    mockUsePermissionStore.mockImplementation((selector: (state: PermissionStoreState) => unknown) =>
      selector({ can: mockCan }),
    );

    // Mock filterMenuByPermissions to return filtered menu
    mockFilterMenuByPermissions.mockReturnValue(filteredMenuMock);

    // Mock cleanMenuForLibrary to return cleaned menu
    mockCleanMenuForLibrary.mockReturnValue(cleanedMenuMock);
  });

  test('should return filtered and cleaned menu configuration', () => {
    const { result } = renderHook(() => useVisibleMenu());

    expect(result.current).toEqual(cleanedMenuMock);
  });

  test('should call filterMenuByPermissions with correct parameters', () => {
    renderHook(() => useVisibleMenu());

    expect(mockFilterMenuByPermissions).toHaveBeenCalledWith(menuConfig, mockCan);
    expect(mockFilterMenuByPermissions).toHaveBeenCalledTimes(1);
  });

  test('should call cleanMenuForLibrary with filtered menu', () => {
    renderHook(() => useVisibleMenu());

    expect(mockCleanMenuForLibrary).toHaveBeenCalledWith(filteredMenuMock);
    expect(mockCleanMenuForLibrary).toHaveBeenCalledTimes(1);
  });

  test('should call usePermissionStore with correct selector', () => {
    renderHook(() => useVisibleMenu());

    expect(mockUsePermissionStore).toHaveBeenCalledWith(expect.any(Function));
    expect(mockUsePermissionStore).toHaveBeenCalledTimes(1);
  });

  test('should memoize the result when can function does not change', () => {
    const { rerender } = renderHook(() => useVisibleMenu());

    // Clear calls from initial render
    vi.clearAllMocks();

    // Re-render without changing the can function
    rerender();

    // Functions should not be called again due to memoization
    expect(mockFilterMenuByPermissions).not.toHaveBeenCalled();
    expect(mockCleanMenuForLibrary).not.toHaveBeenCalled();
  });

  test('should recalculate menu when can function changes', () => {
    const mockCan1 = vi.fn();
    const mockCan2 = vi.fn();

    // First render with mockCan1
    mockUsePermissionStore.mockImplementation((selector: (state: PermissionStoreState) => unknown) =>
      selector({ can: mockCan1 }),
    );

    const { rerender } = renderHook(() => useVisibleMenu());

    expect(mockFilterMenuByPermissions).toHaveBeenCalledWith(menuConfig, mockCan1);

    // Clear mocks
    vi.clearAllMocks();

    // Change the can function
    mockUsePermissionStore.mockImplementation((selector: (state: PermissionStoreState) => unknown) =>
      selector({ can: mockCan2 }),
    );

    // Re-render with different can function
    rerender();

    // Functions should be called again due to dependency change
    expect(mockFilterMenuByPermissions).toHaveBeenCalledWith(menuConfig, mockCan2);
    expect(mockCleanMenuForLibrary).toHaveBeenCalledTimes(1);
  });

  test('should handle empty filtered menu', () => {
    mockFilterMenuByPermissions.mockReturnValue([]);
    mockCleanMenuForLibrary.mockReturnValue([]);

    const { result } = renderHook(() => useVisibleMenu());

    expect(result.current).toEqual([]);
    expect(mockFilterMenuByPermissions).toHaveBeenCalledWith(menuConfig, mockCan);
    expect(mockCleanMenuForLibrary).toHaveBeenCalledWith([]);
  });

  test('should preserve the correct return type', () => {
    const { result } = renderHook(() => useVisibleMenu());

    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current).toEqual(cleanedMenuMock);
  });

  test('should handle complex nested menu structure', () => {
    const complexFilteredMenu: AppMenuConfig[] = [
      {
        href: '/complex',
        label: 'Complex',
        child: [
          {
            href: '/complex/level1',
            label: 'Level 1',
            child: [
              {
                href: '/complex/level1/level2',
                label: 'Level 2',
                permission: 'complex.deep.access',
              },
            ],
          },
        ],
      },
    ];

    const complexCleanedMenu = [
      {
        href: '/complex',
        label: 'Complex',
        child: [
          {
            href: '/complex/level1',
            label: 'Level 1',
            child: [
              {
                href: '/complex/level1/level2',
                label: 'Level 2',
              },
            ],
          },
        ],
      },
    ];

    mockFilterMenuByPermissions.mockReturnValue(complexFilteredMenu);
    mockCleanMenuForLibrary.mockReturnValue(complexCleanedMenu);

    const { result } = renderHook(() => useVisibleMenu());

    expect(result.current).toEqual(complexCleanedMenu);
    expect(mockFilterMenuByPermissions).toHaveBeenCalledWith(menuConfig, mockCan);
    expect(mockCleanMenuForLibrary).toHaveBeenCalledWith(complexFilteredMenu);
  });

  test('should handle menu without permissions', () => {
    const menuWithoutPermissions: AppMenuConfig[] = [
      {
        href: '/public',
        label: 'Public Page',
      },
    ];

    mockFilterMenuByPermissions.mockReturnValue(menuWithoutPermissions);
    mockCleanMenuForLibrary.mockReturnValue(menuWithoutPermissions);

    const { result } = renderHook(() => useVisibleMenu());

    expect(result.current).toEqual(menuWithoutPermissions);
  });
});
