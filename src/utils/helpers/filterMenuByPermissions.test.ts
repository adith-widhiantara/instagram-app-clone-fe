import { describe, test, expect, vi } from 'vitest';
import { filterMenuByPermissions } from './filterMenuByPermissions';
import { AppMenuConfig } from '@/components/sidebar/menuConfig';

describe('filterMenuByPermissions', () => {
  const createMockCanFunction = (allowedPermissions: string[]) => {
    return vi.fn((permissions: string | string[], operator?: 'AND' | 'OR') => {
      if (Array.isArray(permissions)) {
        if (operator === 'AND') {
          return permissions.every(perm => allowedPermissions.includes(perm));
        }
        // Default to 'OR' behavior
        return permissions.some(perm => allowedPermissions.includes(perm));
      }
      return allowedPermissions.includes(permissions);
    });
  };

  test('should return all items when no permissions are required', () => {
    const menuItems: AppMenuConfig[] = [
      { href: '/', label: 'Home' },
      { href: '/settings', label: 'Settings' },
    ];
    const can = createMockCanFunction([]);

    const result = filterMenuByPermissions(menuItems, can);

    expect(result).toEqual(menuItems);
    expect(can).not.toHaveBeenCalled();
  });

  test('should filter out items when user lacks required permission', () => {
    const menuItems: AppMenuConfig[] = [
      { href: '/', label: 'Home' },
      { href: '/admin', label: 'Admin Panel', permission: 'admin.view' },
    ];
    const can = createMockCanFunction(['user.view']);

    const result = filterMenuByPermissions(menuItems, can);

    expect(result).toEqual([{ href: '/', label: 'Home' }]);
    expect(can).toHaveBeenCalledWith('admin.view', undefined);
  });

  test('should include items when user has required permission', () => {
    const menuItems: AppMenuConfig[] = [
      { href: '/', label: 'Home' },
      { href: '/admin', label: 'Admin Panel', permission: 'admin.view' },
    ];
    const can = createMockCanFunction(['admin.view']);

    const result = filterMenuByPermissions(menuItems, can);

    expect(result).toEqual(menuItems);
    expect(can).toHaveBeenCalledWith('admin.view', undefined);
  });

  test('should handle array permissions with OR operator', () => {
    const menuItems: AppMenuConfig[] = [
      {
        href: '/reports',
        label: 'Reports',
        permission: ['admin.view', 'manager.view'],
        operator: 'OR',
      },
    ];
    const can = createMockCanFunction(['manager.view']);

    const result = filterMenuByPermissions(menuItems, can);

    expect(result).toEqual(menuItems);
    expect(can).toHaveBeenCalledWith(['admin.view', 'manager.view'], 'OR');
  });

  test('should handle array permissions with AND operator', () => {
    const menuItems: AppMenuConfig[] = [
      {
        href: '/super-admin',
        label: 'Super Admin',
        permission: ['admin.view', 'super.admin'],
        operator: 'AND',
      },
    ];
    const can = createMockCanFunction(['admin.view']); // Missing 'super.admin'

    const result = filterMenuByPermissions(menuItems, can);

    expect(result).toEqual([]);
    expect(can).toHaveBeenCalledWith(['admin.view', 'super.admin'], 'AND');
  });

  test('should recursively filter child menu items', () => {
    const menuItems: AppMenuConfig[] = [
      {
        href: '/master',
        label: 'Master',
        child: [
          { href: '/master/users', label: 'Users', permission: 'users.index' },
          { href: '/master/clients', label: 'Clients', permission: 'clients.index' },
        ],
      },
    ];
    const can = createMockCanFunction(['users.index']);

    const result = filterMenuByPermissions(menuItems, can);

    expect(result).toEqual([
      {
        href: '/master',
        label: 'Master',
        child: [{ href: '/master/users', label: 'Users', permission: 'users.index' }],
      },
    ]);
  });

  test('should hide parent menu when no children are visible', () => {
    const menuItems: AppMenuConfig[] = [
      {
        href: '/admin',
        label: 'Admin',
        child: [
          { href: '/admin/super-settings', label: 'Super Settings', permission: 'super.admin' },
          { href: '/admin/system-config', label: 'System Config', permission: 'system.config' },
        ],
      },
    ];
    const can = createMockCanFunction(['user.view']);

    const result = filterMenuByPermissions(menuItems, can);

    expect(result).toEqual([]);
  });

  test('should show parent menu when at least one child is visible', () => {
    const menuItems: AppMenuConfig[] = [
      {
        href: '/master',
        label: 'Master',
        permission: 'master.access',
        child: [
          { href: '/master/users', label: 'Users', permission: 'users.index' },
          { href: '/master/clients', label: 'Clients', permission: 'clients.index' },
        ],
      },
    ];
    const can = createMockCanFunction(['master.access', 'users.index']);

    const result = filterMenuByPermissions(menuItems, can);

    expect(result).toEqual([
      {
        href: '/master',
        label: 'Master',
        permission: 'master.access',
        child: [{ href: '/master/users', label: 'Users', permission: 'users.index' }],
      },
    ]);
  });

  test('should handle deeply nested menu structures', () => {
    const menuItems: AppMenuConfig[] = [
      {
        href: '/level1',
        label: 'Level 1',
        child: [
          {
            href: '/level1/level2',
            label: 'Level 2',
            child: [
              { href: '/level1/level2/level3a', label: 'Level 3 A', permission: 'deep.access' },
              { href: '/level1/level2/level3b', label: 'Level 3 B', permission: 'super.deep' },
            ],
          },
        ],
      },
    ];
    const can = createMockCanFunction(['deep.access']);

    const result = filterMenuByPermissions(menuItems, can);

    expect(result).toEqual([
      {
        href: '/level1',
        label: 'Level 1',
        child: [
          {
            href: '/level1/level2',
            label: 'Level 2',
            child: [{ href: '/level1/level2/level3a', label: 'Level 3 A', permission: 'deep.access' }],
          },
        ],
      },
    ]);
  });

  test('should handle empty menu array', () => {
    const menuItems: AppMenuConfig[] = [];
    const can = createMockCanFunction(['any.permission']);

    const result = filterMenuByPermissions(menuItems, can);

    expect(result).toEqual([]);
    expect(can).not.toHaveBeenCalled();
  });

  test('should preserve all menu item properties', () => {
    const menuItems: AppMenuConfig[] = [
      {
        href: '/',
        label: 'Home',
        permission: 'home.view',
        operator: 'OR',
      },
    ];
    const can = createMockCanFunction(['home.view']);

    const result = filterMenuByPermissions(menuItems, can);

    expect(result[0]).toEqual({
      href: '/',
      label: 'Home',
      permission: 'home.view',
      operator: 'OR',
    });
  });

  test('should not include child property when original item has no children', () => {
    const menuItems: AppMenuConfig[] = [{ href: '/simple', label: 'Simple Menu' }];
    const can = createMockCanFunction([]);

    const result = filterMenuByPermissions(menuItems, can);

    expect(result[0]).not.toHaveProperty('child');
  });

  test('should handle parent menu without permission but with accessible children', () => {
    const menuItems: AppMenuConfig[] = [
      {
        href: '/tools',
        label: 'Tools', // No permission required for parent
        child: [
          { href: '/tools/calculator', label: 'Calculator' }, // No permission required
          { href: '/tools/admin', label: 'Admin Tool', permission: 'admin.tools' }, // Permission required
        ],
      },
    ];
    const can = createMockCanFunction(['user.basic']);

    const result = filterMenuByPermissions(menuItems, can);

    expect(result).toEqual([
      {
        href: '/tools',
        label: 'Tools',
        child: [{ href: '/tools/calculator', label: 'Calculator' }],
      },
    ]);
  });

  test('should handle mixed permission scenarios', () => {
    const menuItems: AppMenuConfig[] = [
      { href: '/', label: 'Home' }, // No permission
      { href: '/users', label: 'Users', permission: 'users.index' }, // Has permission
      { href: '/admin', label: 'Admin', permission: 'admin.view' }, // No permission
      {
        href: '/content',
        label: 'Content',
        child: [
          { href: '/content/templates', label: 'Templates', permission: 'templates.index' }, // No permission
          { href: '/content/jobs', label: 'Jobs' }, // No permission
        ],
      },
    ];
    const can = createMockCanFunction(['users.index']);

    const result = filterMenuByPermissions(menuItems, can);

    expect(result).toEqual([
      { href: '/', label: 'Home' },
      { href: '/users', label: 'Users', permission: 'users.index' },
      {
        href: '/content',
        label: 'Content',
        child: [{ href: '/content/jobs', label: 'Jobs' }],
      },
    ]);
  });
});
