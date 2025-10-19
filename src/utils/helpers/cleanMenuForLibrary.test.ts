import { describe, test, expect } from 'vitest';
import { cleanMenuForLibrary } from './cleanMenuForLibrary';
import { AppMenuConfig } from '@/components/sidebar/menuConfig';

describe('cleanMenuForLibrary', () => {
  test('should be a function', () => {
    expect(typeof cleanMenuForLibrary).toBe('function');
  });

  describe('basic functionality', () => {
    test('should return empty array when given empty array', () => {
      const result = cleanMenuForLibrary([]);
      expect(result).toEqual([]);
    });

    test('should preserve basic menu properties without custom properties', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/home',
          label: 'Home',
        },
      ];

      const result = cleanMenuForLibrary(input);

      expect(result).toEqual([
        {
          href: '/home',
          label: 'Home',
        },
      ]);
    });

    test('should remove custom permission property', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/admin',
          label: 'Admin',
          permission: 'admin.view',
        },
      ];

      const result = cleanMenuForLibrary(input);

      expect(result).toEqual([
        {
          href: '/admin',
          label: 'Admin',
        },
      ]);
      expect(result[0]).not.toHaveProperty('permission');
    });

    test('should remove custom operator property', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/settings',
          label: 'Settings',
          operator: 'AND',
        },
      ];

      const result = cleanMenuForLibrary(input);

      expect(result).toEqual([
        {
          href: '/settings',
          label: 'Settings',
        },
      ]);
      expect(result[0]).not.toHaveProperty('operator');
    });

    test('should remove both permission and operator properties', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/dashboard',
          label: 'Dashboard',
          permission: ['dashboard.view', 'dashboard.read'],
          operator: 'OR',
        },
      ];

      const result = cleanMenuForLibrary(input);

      expect(result).toEqual([
        {
          href: '/dashboard',
          label: 'Dashboard',
        },
      ]);
      expect(result[0]).not.toHaveProperty('permission');
      expect(result[0]).not.toHaveProperty('operator');
    });

    test('should preserve other standard menu properties', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/profile',
          label: 'Profile',
          icon: 'user-icon',
          permission: 'profile.view',
          operator: 'AND',
        },
      ];

      const result = cleanMenuForLibrary(input);

      expect(result).toEqual([
        {
          href: '/profile',
          label: 'Profile',
          icon: 'user-icon',
        },
      ]);
      expect(result[0]).not.toHaveProperty('permission');
      expect(result[0]).not.toHaveProperty('operator');
    });
  });

  describe('nested menu handling', () => {
    test('should handle single level nested menu', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/master',
          label: 'Master',
          child: [
            {
              href: '/master/users',
              label: 'Users',
              permission: 'users.index',
            },
            {
              href: '/master/clients',
              label: 'Clients',
              permission: 'clients.index',
              operator: 'OR',
            },
          ],
        },
      ];

      const result = cleanMenuForLibrary(input);

      expect(result).toEqual([
        {
          href: '/master',
          label: 'Master',
          child: [
            {
              href: '/master/users',
              label: 'Users',
            },
            {
              href: '/master/clients',
              label: 'Clients',
            },
          ],
        },
      ]);
      expect(result[0].child?.[0]).not.toHaveProperty('permission');
      expect(result[0].child?.[1]).not.toHaveProperty('permission');
      expect(result[0].child?.[1]).not.toHaveProperty('operator');
    });

    test('should handle deeply nested menu structure', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/content',
          label: 'Content',
          permission: 'content.view',
          child: [
            {
              href: '/content/posts',
              label: 'Posts',
              permission: 'posts.index',
              child: [
                {
                  href: '/content/posts/published',
                  label: 'Published',
                  permission: 'posts.published',
                  operator: 'AND',
                },
                {
                  href: '/content/posts/draft',
                  label: 'Draft',
                  permission: ['posts.draft', 'posts.edit'],
                  operator: 'OR',
                },
              ],
            },
          ],
        },
      ];

      const result = cleanMenuForLibrary(input);

      expect(result).toEqual([
        {
          href: '/content',
          label: 'Content',
          child: [
            {
              href: '/content/posts',
              label: 'Posts',
              child: [
                {
                  href: '/content/posts/published',
                  label: 'Published',
                },
                {
                  href: '/content/posts/draft',
                  label: 'Draft',
                },
              ],
            },
          ],
        },
      ]);

      // Verify custom properties are removed at all levels
      expect(result[0]).not.toHaveProperty('permission');
      expect(result[0].child?.[0]).not.toHaveProperty('permission');
      expect(result[0].child?.[0].child?.[0]).not.toHaveProperty('permission');
      expect(result[0].child?.[0].child?.[0]).not.toHaveProperty('operator');
      expect(result[0].child?.[0].child?.[1]).not.toHaveProperty('permission');
      expect(result[0].child?.[0].child?.[1]).not.toHaveProperty('operator');
    });

    test('should handle empty child arrays', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/empty-parent',
          label: 'Empty Parent',
          permission: 'parent.view',
          child: [],
        },
      ];

      const result = cleanMenuForLibrary(input);

      expect(result).toEqual([
        {
          href: '/empty-parent',
          label: 'Empty Parent',
        },
      ]);
      expect(result[0]).not.toHaveProperty('permission');
      expect(result[0]).not.toHaveProperty('child');
    });

    test('should handle mixed nested structure with some items having children and others not', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/dashboard',
          label: 'Dashboard',
        },
        {
          href: '/admin',
          label: 'Admin',
          permission: 'admin.access',
          child: [
            {
              href: '/admin/users',
              label: 'Users',
              permission: 'users.manage',
              operator: 'AND',
            },
          ],
        },
        {
          href: '/profile',
          label: 'Profile',
          permission: 'profile.view',
        },
      ];

      const result = cleanMenuForLibrary(input);

      expect(result).toEqual([
        {
          href: '/dashboard',
          label: 'Dashboard',
        },
        {
          href: '/admin',
          label: 'Admin',
          child: [
            {
              href: '/admin/users',
              label: 'Users',
            },
          ],
        },
        {
          href: '/profile',
          label: 'Profile',
        },
      ]);

      expect(result[1]).not.toHaveProperty('permission');
      expect(result[1].child?.[0]).not.toHaveProperty('permission');
      expect(result[1].child?.[0]).not.toHaveProperty('operator');
      expect(result[2]).not.toHaveProperty('permission');
    });
  });

  describe('data types and edge cases', () => {
    test('should handle string permission', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/single-perm',
          label: 'Single Permission',
          permission: 'single.permission',
        },
      ];

      const result = cleanMenuForLibrary(input);

      expect(result[0]).not.toHaveProperty('permission');
      expect(result).toEqual([
        {
          href: '/single-perm',
          label: 'Single Permission',
        },
      ]);
    });

    test('should handle array permission', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/multi-perm',
          label: 'Multiple Permissions',
          permission: ['perm1', 'perm2', 'perm3'],
        },
      ];

      const result = cleanMenuForLibrary(input);

      expect(result[0]).not.toHaveProperty('permission');
      expect(result).toEqual([
        {
          href: '/multi-perm',
          label: 'Multiple Permissions',
        },
      ]);
    });

    test('should handle AND operator', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/and-op',
          label: 'AND Operator',
          operator: 'AND',
        },
      ];

      const result = cleanMenuForLibrary(input);

      expect(result[0]).not.toHaveProperty('operator');
      expect(result).toEqual([
        {
          href: '/and-op',
          label: 'AND Operator',
        },
      ]);
    });

    test('should handle OR operator', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/or-op',
          label: 'OR Operator',
          operator: 'OR',
        },
      ];

      const result = cleanMenuForLibrary(input);

      expect(result[0]).not.toHaveProperty('operator');
      expect(result).toEqual([
        {
          href: '/or-op',
          label: 'OR Operator',
        },
      ]);
    });

    test('should handle undefined child property correctly', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/no-child',
          label: 'No Child',
          permission: 'test.permission',
          child: undefined,
        },
      ];

      const result = cleanMenuForLibrary(input);

      expect(result).toEqual([
        {
          href: '/no-child',
          label: 'No Child',
        },
      ]);
      expect(result[0]).not.toHaveProperty('permission');
      expect(result[0]).not.toHaveProperty('child');
    });

    test('should preserve null and undefined values for standard properties', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/test',
          label: 'Test',
          icon: undefined,
          permission: 'test.perm',
        },
      ];

      const result = cleanMenuForLibrary(input);

      expect(result).toEqual([
        {
          href: '/test',
          label: 'Test',
          icon: undefined,
        },
      ]);
      expect(result[0]).not.toHaveProperty('permission');
    });
  });

  describe('immutability', () => {
    test('should not modify the original input array', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/original',
          label: 'Original',
          permission: 'original.permission',
          operator: 'AND',
        },
      ];

      const originalCopy = JSON.parse(JSON.stringify(input));
      const result = cleanMenuForLibrary(input);

      // Original should remain unchanged
      expect(input).toEqual(originalCopy);
      expect(input[0]).toHaveProperty('permission');
      expect(input[0]).toHaveProperty('operator');

      // Result should be cleaned
      expect(result[0]).not.toHaveProperty('permission');
      expect(result[0]).not.toHaveProperty('operator');
    });

    test('should not modify nested objects in original input', () => {
      const input: AppMenuConfig[] = [
        {
          href: '/parent',
          label: 'Parent',
          permission: 'parent.perm',
          child: [
            {
              href: '/child',
              label: 'Child',
              permission: 'child.perm',
              operator: 'OR',
            },
          ],
        },
      ];

      const originalCopy = JSON.parse(JSON.stringify(input));
      cleanMenuForLibrary(input);

      expect(input).toEqual(originalCopy);
      expect(input[0].child?.[0]).toHaveProperty('permission');
      expect(input[0].child?.[0]).toHaveProperty('operator');
    });
  });

  describe('comprehensive real-world scenarios', () => {
    test('should handle complex menu structure similar to actual menuConfig', () => {
      const input: AppMenuConfig[] = [
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
            {
              href: '/master/customer-data-structure',
              label: 'Customer Data Structure',
              permission: 'customerDataStructure.index',
            },
            {
              href: '/master/customers',
              label: 'Customers',
              permission: 'customers.index',
            },
            {
              href: '/master/tags',
              label: 'Tags',
              permission: 'tags.index',
            },
          ],
        },
        {
          href: '/content',
          label: 'Content',
          child: [
            {
              href: '/content/templates',
              label: 'Templates',
              permission: 'templates.index',
              operator: 'AND',
            },
            {
              href: '/content/jobs',
              label: 'Jobs',
              permission: ['jobs.index', 'jobs.view'],
              operator: 'OR',
            },
          ],
        },
      ];

      const result = cleanMenuForLibrary(input);

      expect(result).toEqual([
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
            {
              href: '/master/users',
              label: 'Users',
            },
            {
              href: '/master/customer-data-structure',
              label: 'Customer Data Structure',
            },
            {
              href: '/master/customers',
              label: 'Customers',
            },
            {
              href: '/master/tags',
              label: 'Tags',
            },
          ],
        },
        {
          href: '/content',
          label: 'Content',
          child: [
            {
              href: '/content/templates',
              label: 'Templates',
            },
            {
              href: '/content/jobs',
              label: 'Jobs',
            },
          ],
        },
      ]);

      // Verify no custom properties remain at any level
      result.forEach(item => {
        expect(item).not.toHaveProperty('permission');
        expect(item).not.toHaveProperty('operator');
        if (item.child) {
          item.child.forEach(childItem => {
            expect(childItem).not.toHaveProperty('permission');
            expect(childItem).not.toHaveProperty('operator');
          });
        }
      });
    });
  });
});
