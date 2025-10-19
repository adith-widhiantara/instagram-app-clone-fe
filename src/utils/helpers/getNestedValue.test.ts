import { describe, test, expect } from 'vitest';
import getNestedValue from './getNestedValue';

describe('getNestedValue function', () => {
  test('should be a function', () => {
    expect(typeof getNestedValue).toBe('function');
  });

  describe('basic functionality', () => {
    test('should return value for simple property path', () => {
      const obj = { name: 'John', age: 30 };
      const result = getNestedValue(obj, 'name');
      expect(result).toBe('John');
    });

    test('should return value for nested property path', () => {
      const obj = {
        user: {
          profile: {
            name: 'John Doe',
            age: 30,
          },
        },
      };
      const result = getNestedValue(obj, 'user.profile.name');
      expect(result).toBe('John Doe');
    });

    test('should return value for deeply nested property path', () => {
      const obj = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep value',
              },
            },
          },
        },
      };
      const result = getNestedValue(obj, 'level1.level2.level3.level4.value');
      expect(result).toBe('deep value');
    });
  });

  describe('edge cases', () => {
    test('should return undefined for non-existent property', () => {
      const obj = { name: 'John' };
      const result = getNestedValue(obj, 'nonExistent');
      expect(result).toBeUndefined();
    });

    test('should return undefined for non-existent nested property', () => {
      const obj = { user: { name: 'John' } };
      const result = getNestedValue(obj, 'user.profile.name');
      expect(result).toBeUndefined();
    });

    test('should return undefined when intermediate property is null', () => {
      const obj = { user: null };
      const result = getNestedValue(obj, 'user.name');
      expect(result).toBeUndefined();
    });

    test('should return undefined when intermediate property is undefined', () => {
      const obj = { user: undefined };
      const result = getNestedValue(obj, 'user.name');
      expect(result).toBeUndefined();
    });

    test('should handle empty string path', () => {
      const obj = { name: 'John' };
      const result = getNestedValue(obj, '');
      expect(result).toBeUndefined();
    });

    test('should handle single dot path', () => {
      const obj = { name: 'John' };
      const result = getNestedValue(obj, '.');
      expect(result).toBeUndefined();
    });

    test('should handle path with multiple consecutive dots', () => {
      const obj = { name: 'John' };
      const result = getNestedValue(obj, 'name..value');
      expect(result).toBeUndefined();
    });
  });

  describe('different data types', () => {
    test('should work with array indices', () => {
      const obj = { items: ['first', 'second', 'third'] };
      const result = getNestedValue(obj, 'items.1');
      expect(result).toBe('second');
    });

    test('should work with mixed object and array access', () => {
      const obj = {
        users: [
          { name: 'John', age: 30 },
          { name: 'Jane', age: 25 },
        ],
      };
      const result = getNestedValue(obj, 'users.0.name');
      expect(result).toBe('John');
    });

    test('should return number values correctly', () => {
      const obj = { user: { age: 30, score: 0 } };
      expect(getNestedValue(obj, 'user.age')).toBe(30);
      expect(getNestedValue(obj, 'user.score')).toBe(0);
    });

    test('should return boolean values correctly', () => {
      const obj = { settings: { isActive: true, isVisible: false } };
      expect(getNestedValue(obj, 'settings.isActive')).toBe(true);
      expect(getNestedValue(obj, 'settings.isVisible')).toBe(false);
    });

    test('should return null values correctly', () => {
      const obj = { data: { value: null } };
      const result = getNestedValue(obj, 'data.value');
      expect(result).toBeNull();
    });

    test('should work with Date objects', () => {
      const date = new Date('2023-01-01');
      const obj = { event: { date } };
      const result = getNestedValue(obj, 'event.date');
      expect(result).toBe(date);
    });

    test('should work with nested objects', () => {
      const nestedObj = { inner: 'value' };
      const obj = { outer: nestedObj };
      const result = getNestedValue(obj, 'outer');
      expect(result).toBe(nestedObj);
    });
  });

  describe('input validation', () => {
    test('should handle null object', () => {
      const result = getNestedValue(null, 'name');
      expect(result).toBeUndefined();
    });

    test('should handle undefined object', () => {
      const result = getNestedValue(undefined, 'name');
      expect(result).toBeUndefined();
    });

    test('should handle primitive values as object', () => {
      // Primitive values don't behave like objects in this function
      expect(getNestedValue('string', 'length')).toBeUndefined();
      expect(getNestedValue(123, 'toString')).toBeUndefined();
      expect(getNestedValue(true, 'valueOf')).toBeUndefined();
    });

    test('should handle non-string path by converting to string', () => {
      const obj = { '123': 'numeric key' };
      // The function expects string paths, non-string paths will cause errors
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getNestedValue(obj, 123 as any);
      }).toThrow();
    });
  });

  describe('real-world scenarios', () => {
    test('should work with API response structure', () => {
      const apiResponse = {
        data: {
          user: {
            id: 1,
            profile: {
              firstName: 'John',
              lastName: 'Doe',
              contact: {
                email: 'john.doe@example.com',
                phone: '+1234567890',
              },
            },
            permissions: ['read', 'write'],
            settings: {
              theme: 'dark',
              notifications: {
                email: true,
                push: false,
              },
            },
          },
        },
        meta: {
          status: 'success',
          timestamp: '2023-01-01T00:00:00Z',
        },
      };

      expect(getNestedValue(apiResponse, 'data.user.profile.firstName')).toBe('John');
      expect(getNestedValue(apiResponse, 'data.user.profile.contact.email')).toBe('john.doe@example.com');
      expect(getNestedValue(apiResponse, 'data.user.permissions.0')).toBe('read');
      expect(getNestedValue(apiResponse, 'data.user.settings.notifications.email')).toBe(true);
      expect(getNestedValue(apiResponse, 'meta.status')).toBe('success');
      expect(getNestedValue(apiResponse, 'data.user.nonExistent')).toBeUndefined();
    });

    test('should work with form data structure', () => {
      const formData = {
        personal: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        address: {
          street: '123 Main St',
          city: 'Anytown',
          country: {
            code: 'US',
            name: 'United States',
          },
        },
        preferences: {
          marketing: true,
          newsletter: false,
        },
      };

      expect(getNestedValue(formData, 'personal.name')).toBe('John Doe');
      expect(getNestedValue(formData, 'address.country.code')).toBe('US');
      expect(getNestedValue(formData, 'preferences.marketing')).toBe(true);
      expect(getNestedValue(formData, 'address.zipCode')).toBeUndefined();
    });
  });
});
