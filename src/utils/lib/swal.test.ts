import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as swalModule from './swal';

describe('swal utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('swalDeleteWithList function', () => {
    test('should be a function', () => {
      expect(typeof swalModule.swalDeleteWithList).toBe('function');
    });

    test('should generate correct HTML for list items', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];
      const mockPreConfirm = vi.fn();
      let capturedHtml = '';

      // Mock swalDelete.fire to capture the HTML parameter
      const mockFire = vi.fn(config => {
        capturedHtml = config.html;
        return Promise.resolve({
          isConfirmed: true,
          isDenied: false,
          isDismissed: false,
          value: undefined,
        });
      });

      // Spy on swalDelete.fire
      const swalDeleteSpy = vi.spyOn(swalModule.swalDelete, 'fire').mockImplementation(mockFire);

      swalModule.swalDeleteWithList({ items, preConfirm: mockPreConfirm });

      // Verify the HTML contains all expected elements
      expect(capturedHtml).toContain(
        '<p>This action cannot be undone. Are you sure you want to proceed and delete the data?</p>',
      );
      expect(capturedHtml).toContain('<p>These will be deleted:</p>');
      expect(capturedHtml).toContain('<li>Item 1</li>');
      expect(capturedHtml).toContain('<li>Item 2</li>');
      expect(capturedHtml).toContain('<li>Item 3</li>');
      expect(capturedHtml).toContain('style="text-align: start');
      expect(capturedHtml).toContain('style="list-style: disc; list-style-position: inside;"');

      // Verify the preConfirm function was passed
      expect(swalDeleteSpy).toHaveBeenCalledWith({
        html: expect.any(String),
        preConfirm: mockPreConfirm,
      });

      swalDeleteSpy.mockRestore();
    });

    test('should handle empty items array', () => {
      const items: string[] = [];
      const mockPreConfirm = vi.fn();
      let capturedHtml = '';

      const mockFire = vi.fn(config => {
        capturedHtml = config.html;
        return Promise.resolve({
          isConfirmed: true,
          isDenied: false,
          isDismissed: false,
          value: undefined,
        });
      });

      const swalDeleteSpy = vi.spyOn(swalModule.swalDelete, 'fire').mockImplementation(mockFire);

      swalModule.swalDeleteWithList({ items, preConfirm: mockPreConfirm });

      expect(capturedHtml).toContain('<ul style="list-style: disc; list-style-position: inside;"></ul>');
      expect(capturedHtml).toContain('<p>These will be deleted:</p>');

      swalDeleteSpy.mockRestore();
    });

    test('should handle items with special characters', () => {
      const items = ['Item with "quotes"', "Item with 'apostrophes'", 'Item with & ampersand', 'Item with <script>'];
      const mockPreConfirm = vi.fn();
      let capturedHtml = '';

      const mockFire = vi.fn(config => {
        capturedHtml = config.html;
        return Promise.resolve({
          isConfirmed: true,
          isDenied: false,
          isDismissed: false,
          value: undefined,
        });
      });

      const swalDeleteSpy = vi.spyOn(swalModule.swalDelete, 'fire').mockImplementation(mockFire);

      swalModule.swalDeleteWithList({ items, preConfirm: mockPreConfirm });

      expect(capturedHtml).toContain('<li>Item with "quotes"</li>');
      expect(capturedHtml).toContain("<li>Item with 'apostrophes'</li>");
      expect(capturedHtml).toContain('<li>Item with & ampersand</li>');
      expect(capturedHtml).toContain('<li>Item with <script></li>');

      swalDeleteSpy.mockRestore();
    });

    test('should handle single item', () => {
      const items = ['Single Item'];
      const mockPreConfirm = vi.fn();
      let capturedHtml = '';

      const mockFire = vi.fn(config => {
        capturedHtml = config.html;
        return Promise.resolve({
          isConfirmed: true,
          isDenied: false,
          isDismissed: false,
          value: undefined,
        });
      });

      const swalDeleteSpy = vi.spyOn(swalModule.swalDelete, 'fire').mockImplementation(mockFire);

      swalModule.swalDeleteWithList({ items, preConfirm: mockPreConfirm });

      expect(capturedHtml).toContain('<li>Single Item</li>');
      expect(capturedHtml).toContain('<p>These will be deleted:</p>');

      swalDeleteSpy.mockRestore();
    });

    test('should generate well-formed HTML structure', () => {
      const items = ['Test Item'];
      const mockPreConfirm = vi.fn();
      let capturedHtml = '';

      const mockFire = vi.fn(config => {
        capturedHtml = config.html;
        return Promise.resolve({
          isConfirmed: true,
          isDenied: false,
          isDismissed: false,
          value: undefined,
        });
      });

      const swalDeleteSpy = vi.spyOn(swalModule.swalDelete, 'fire').mockImplementation(mockFire);

      swalModule.swalDeleteWithList({ items, preConfirm: mockPreConfirm });

      // Check HTML structure
      expect(capturedHtml).toMatch(/<div[^>]*style="[^"]*text-align: start[^"]*">/);
      expect(capturedHtml).toMatch(/<p>This action cannot be undone\./);
      expect(capturedHtml).toMatch(/<p>These will be deleted:<\/p>/);
      expect(capturedHtml).toMatch(/<ul[^>]*style="[^"]*list-style: disc[^"]*">/);
      expect(capturedHtml).toMatch(/<li>Test Item<\/li>/);
      expect(capturedHtml).toMatch(/<\/ul>/);
      expect(capturedHtml).toMatch(/<\/div>/);

      swalDeleteSpy.mockRestore();
    });

    test('should pass preConfirm function correctly', () => {
      const items = ['Item 1'];
      const mockPreConfirm = vi.fn();

      const mockFire = vi.fn(() => {
        return Promise.resolve({
          isConfirmed: true,
          isDenied: false,
          isDismissed: false,
          value: undefined,
        });
      });

      const swalDeleteSpy = vi.spyOn(swalModule.swalDelete, 'fire').mockImplementation(mockFire);

      swalModule.swalDeleteWithList({ items, preConfirm: mockPreConfirm });

      expect(swalDeleteSpy).toHaveBeenCalledWith({
        html: expect.any(String),
        preConfirm: mockPreConfirm,
      });

      swalDeleteSpy.mockRestore();
    });
  });

  describe('Module exports verification', () => {
    test('should export swalDeleteWithList function', () => {
      expect(swalModule.swalDeleteWithList).toBeDefined();
      expect(typeof swalModule.swalDeleteWithList).toBe('function');
    });

    test('should export other swal instances', () => {
      expect(swalModule.swal).toBeDefined();
      expect(swalModule.swalDelete).toBeDefined();
      expect(swalModule.swalSuccess).toBeDefined();
      expect(swalModule.swalError).toBeDefined();
      expect(swalModule.swalConfirm).toBeDefined();
      expect(swalModule.swalLoading).toBeDefined();
      expect(swalModule.swalWithInputText).toBeDefined();
    });
  });
});
