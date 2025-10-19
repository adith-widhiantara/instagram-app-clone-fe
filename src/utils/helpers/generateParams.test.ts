import { describe, it, expect, vi } from 'vitest';
import { generateParams } from './generateParams';

describe('generateParams', () => {
  describe('Basic functionality', () => {
    it('should generate query string with single string parameter', () => {
      const params = { name: 'john' };
      const result = generateParams(params);
      expect(result).toBe('?name=john');
    });

    it('should generate query string with multiple string parameters', () => {
      const params = { name: 'john', city: 'newyork' };
      const result = generateParams(params);
      expect(result).toBe('?name=john&city=newyork');
    });

    it('should generate query string with number parameter', () => {
      const params = { age: 25, count: 0 };
      const result = generateParams(params);
      expect(result).toBe('?age=25&count=0');
    });

    it('should generate query string with boolean parameters', () => {
      const params = { active: true, verified: false };
      const result = generateParams(params);
      expect(result).toBe('?active=true&verified=false');
    });

    it('should generate query string with array parameter', () => {
      const params = { tags: ['javascript', 'typescript'] };
      const result = generateParams(params);
      expect(result).toBe('?tags=javascript,typescript');
    });

    it('should generate query string with mixed parameter types', () => {
      const params = {
        name: 'john',
        age: 25,
        active: true,
        tags: ['dev', 'senior'],
      };
      const result = generateParams(params);
      expect(result).toBe('?name=john&age=25&active=true&tags=dev,senior');
    });
  });

  describe('Edge cases and filtering', () => {
    it('should filter out undefined values', () => {
      const params = { name: 'john', age: undefined, city: 'newyork' };
      const result = generateParams(params);
      expect(result).toBe('?name=john&city=newyork');
    });

    it('should filter out empty string values', () => {
      const params = { name: 'john', description: '', city: 'newyork' };
      const result = generateParams(params);
      expect(result).toBe('?name=john&city=newyork');
    });

    it('should filter out empty arrays', () => {
      const params = { name: 'john', tags: [], categories: ['web'] };
      const result = generateParams(params);
      expect(result).toBe('?name=john&categories=web');
    });

    it('should filter out "tab" parameter', () => {
      const params = { name: 'john', tab: 'profile', age: 25 };
      const result = generateParams(params);
      expect(result).toBe('?name=john&age=25');
    });

    it('should filter out empty key', () => {
      const params = { '': 'value', name: 'john' };
      const result = generateParams(params);
      expect(result).toBe('?name=john');
    });

    it('should handle all filtered parameters', () => {
      const params = {
        tab: 'profile',
        name: '',
        age: undefined,
        tags: [] as string[],
      };
      const result = generateParams(params);
      expect(result).toBe('?');
    });

    it('should handle empty params object', () => {
      const params = {};
      const result = generateParams(params);
      expect(result).toBe('?');
    });
  });

  describe('URL encoding scenarios', () => {
    it('should handle special characters in values', () => {
      const params = { search: 'hello world', email: 'test@example.com' };
      const result = generateParams(params);
      expect(result).toBe('?search=hello world&email=test@example.com');
    });

    it('should handle special characters in array values', () => {
      const params = { terms: ['hello world', 'test@example.com'] };
      const result = generateParams(params);
      expect(result).toBe('?terms=hello world,test@example.com');
    });
  });

  describe('Ampersand handling', () => {
    it('should not add trailing ampersand for single parameter', () => {
      const params = { name: 'john' };
      const result = generateParams(params);
      expect(result).not.toMatch(/&$/);
    });

    it('should not add trailing ampersand for multiple parameters', () => {
      const params = { name: 'john', age: 25 };
      const result = generateParams(params);
      expect(result).not.toMatch(/&$/);
    });

    it('should not add ampersand when all but last parameter is filtered', () => {
      const params = { tab: 'profile', name: '', age: 25 };
      const result = generateParams(params);
      expect(result).toBe('?age=25');
      expect(result).not.toMatch(/&$/);
    });

    it('should handle mixed valid and invalid parameters correctly', () => {
      const params = {
        name: 'john',
        tab: 'profile',
        age: undefined,
        city: 'newyork',
        tags: [] as string[],
        active: true,
      };
      const result = generateParams(params);
      expect(result).toBe('?name=john&city=newyork&active=true');
      expect(result).not.toMatch(/&$/);
    });

    it('should properly connect valid parameters when invalid ones are in between', () => {
      // This test exposes the ampersand bug in the original implementation
      const params = {
        first: 'a',
        invalid: '', // This will be filtered out
        second: 'b',
        third: 'c',
      };
      const result = generateParams(params);
      // The bug would produce '?first=a&second=bthird=c' (missing & between second and third)
      expect(result).toBe('?first=a&second=b&third=c');
    });
  });

  describe('Object.entries behavior', () => {
    it('should maintain parameter order when possible', () => {
      // Mock Object.entries to ensure consistent ordering for testing
      const mockEntries = vi.spyOn(Object, 'entries');
      const params = { a: '1', b: '2', c: '3' };

      mockEntries.mockReturnValue([
        ['a', '1'],
        ['b', '2'],
        ['c', '3'],
      ]);

      const result = generateParams(params);
      expect(result).toBe('?a=1&b=2&c=3');

      mockEntries.mockRestore();
    });

    it('should handle when Object.entries returns empty array', () => {
      const mockEntries = vi.spyOn(Object, 'entries');
      mockEntries.mockReturnValue([]);

      const result = generateParams({});
      expect(result).toBe('?');

      mockEntries.mockRestore();
    });
  });

  describe('Type coercion', () => {
    it('should convert number 0 to string "0"', () => {
      const params = { count: 0 };
      const result = generateParams(params);
      expect(result).toBe('?count=0');
    });

    it('should convert boolean false to string "false"', () => {
      const params = { active: false };
      const result = generateParams(params);
      expect(result).toBe('?active=false');
    });

    it('should handle string array parameter', () => {
      const params = { mixed: ['string1', 'string2', 'string3'] };
      const result = generateParams(params);
      expect(result).toBe('?mixed=string1,string2,string3');
    });
  });

  describe('Complex scenarios', () => {
    it('should handle large number of parameters', () => {
      const params: Record<string, string> = {};
      for (let i = 0; i < 100; i++) {
        params[`param${i}`] = `value${i}`;
      }

      const result = generateParams(params);
      expect(result).toMatch(/^\?/);
      expect(result.split('&')).toHaveLength(100);
    });

    it('should handle parameters with null-like string values', () => {
      const params = {
        nullString: 'null',
        undefinedString: 'undefined',
        emptyString: '',
        validValue: 'test',
      };
      const result = generateParams(params);
      expect(result).toBe('?nullString=null&undefinedString=undefined&validValue=test');
    });
  });
});
