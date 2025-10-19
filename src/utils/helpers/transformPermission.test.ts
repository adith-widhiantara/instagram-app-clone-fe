import { describe, test, expect } from 'vitest';
import { transformPermissions, type PermissionNode } from './transformPermission';

describe('transformPermissions function', () => {
  test('should be a function', () => {
    expect(typeof transformPermissions).toBe('function');
  });

  describe('basic functionality', () => {
    test('should transform simple permission strings', () => {
      const permissions = ['read', 'write', 'delete'];
      const result = transformPermissions(permissions);

      expect(result).toEqual({
        read: true,
        write: true,
        delete: true,
      });
    });

    test('should transform single nested permission', () => {
      const permissions = ['user.read'];
      const result = transformPermissions(permissions);

      expect(result).toEqual({
        user: {
          read: true,
        },
      });
    });

    test('should transform multiple nested permissions', () => {
      const permissions = ['user.read', 'user.write', 'admin.delete'];
      const result = transformPermissions(permissions);

      expect(result).toEqual({
        user: {
          read: true,
          write: true,
        },
        admin: {
          delete: true,
        },
      });
    });

    test('should transform deeply nested permissions', () => {
      const permissions = ['app.module.feature.action'];
      const result = transformPermissions(permissions);

      expect(result).toEqual({
        app: {
          module: {
            feature: {
              action: true,
            },
          },
        },
      });
    });

    test('should transform mixed depth permissions', () => {
      const permissions = ['read', 'user.profile.view', 'admin.settings.security.update', 'dashboard.stats'];
      const result = transformPermissions(permissions);

      expect(result).toEqual({
        read: true,
        user: {
          profile: {
            view: true,
          },
        },
        admin: {
          settings: {
            security: {
              update: true,
            },
          },
        },
        dashboard: {
          stats: true,
        },
      });
    });
  });

  describe('edge cases', () => {
    test('should return empty object for empty array', () => {
      const permissions: string[] = [];
      const result = transformPermissions(permissions);

      expect(result).toEqual({});
    });

    test('should handle null input gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = transformPermissions(null as any);

      expect(result).toEqual({});
    });

    test('should handle undefined input gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = transformPermissions(undefined as any);

      expect(result).toEqual({});
    });

    test('should handle non-array input gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = transformPermissions('not-an-array' as any);

      expect(result).toEqual({});
    });

    test('should handle array with non-string elements', () => {
      // The function will throw an error when encountering non-string elements
      // since it tries to call .split() on them
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const permissions = ['valid.permission', 123, null, undefined, 'another.valid'] as any;

      expect(() => transformPermissions(permissions)).toThrow();
    });

    test('should handle empty strings in array', () => {
      const permissions = ['', 'valid.permission', ''];
      const result = transformPermissions(permissions);

      expect(result).toEqual({
        '': true,
        valid: {
          permission: true,
        },
      });
    });
  });

  describe('overwriting behavior', () => {
    test('should not overwrite existing nested objects', () => {
      const permissions = ['user.read', 'user.write', 'user.profile.view'];
      const result = transformPermissions(permissions);

      expect(result).toEqual({
        user: {
          read: true,
          write: true,
          profile: {
            view: true,
          },
        },
      });
    });

    test('should handle conflicting permission levels', () => {
      // If we have both 'user' and 'user.profile', the function should
      // preserve the nested structure and not overwrite
      const permissions = ['user.profile.view', 'user.read'];
      const result = transformPermissions(permissions);

      expect(result).toEqual({
        user: {
          profile: {
            view: true,
          },
          read: true,
        },
      });
    });

    test('should handle duplicate permissions', () => {
      const permissions = ['user.read', 'user.read', 'admin.write', 'user.read'];
      const result = transformPermissions(permissions);

      expect(result).toEqual({
        user: {
          read: true,
        },
        admin: {
          write: true,
        },
      });
    });
  });

  describe('special characters in permission keys', () => {
    test('should handle permissions with special characters', () => {
      const permissions = ['user-profile.read', 'admin_panel.write', 'api.v1.get'];
      const result = transformPermissions(permissions);

      expect(result).toEqual({
        'user-profile': {
          read: true,
        },
        admin_panel: {
          write: true,
        },
        api: {
          v1: {
            get: true,
          },
        },
      });
    });

    test('should handle permissions with numbers', () => {
      const permissions = ['module1.action2', 'v2.api.endpoint'];
      const result = transformPermissions(permissions);

      expect(result).toEqual({
        module1: {
          action2: true,
        },
        v2: {
          api: {
            endpoint: true,
          },
        },
      });
    });
  });

  describe('type checking', () => {
    test('should return PermissionNode type', () => {
      const permissions = ['user.read'];
      const result: PermissionNode = transformPermissions(permissions);

      expect(typeof result).toBe('object');
      expect(result).not.toBeNull();
    });

    test('should create proper nested structure matching PermissionNode type', () => {
      const permissions = ['deeply.nested.permission.structure'];
      const result = transformPermissions(permissions);

      // Verify the structure matches the PermissionNode type definition
      expect(typeof result.deeply).toBe('object');
      expect(typeof (result.deeply as PermissionNode).nested).toBe('object');
      expect(typeof ((result.deeply as PermissionNode).nested as PermissionNode).permission).toBe('object');
      const structureValue = ((result.deeply as PermissionNode).nested as PermissionNode).permission as PermissionNode;
      expect(structureValue.structure).toBe(true);
    });
  });

  describe('large dataset performance', () => {
    test('should handle large number of permissions efficiently', () => {
      const permissions: string[] = [];

      // Generate 1000 permissions with various nesting levels
      for (let i = 0; i < 1000; i++) {
        permissions.push(`module${i % 10}.action${i % 5}.permission${i}`);
      }

      const startTime = performance.now();
      const result = transformPermissions(permissions);
      const endTime = performance.now();

      // Should complete within reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);

      // Verify structure is correct
      expect(typeof result).toBe('object');
      expect(Object.keys(result)).toHaveLength(10); // module0 to module9
    });
  });
});
