import { describe, test, expect, vi, beforeEach } from 'vitest';
import { AxiosError, AxiosResponse } from 'axios';
import * as swalModule from '@/utils/lib/swal';
import { handleAxiosError, handleGenericError, handleApiError } from './handleError';

// Mock the swal module
vi.mock('@/utils/lib/swal', () => ({
  swalErrorDefault: {
    fire: vi.fn(),
  },
}));

// Helper function to create mock AxiosError
const createMockAxiosError = (responseData?: unknown): AxiosError => {
  const error = new AxiosError('Test error');
  if (responseData !== undefined) {
    error.response = {
      data: responseData,
      status: 422,
      statusText: 'Unprocessable Entity',
      headers: {},
      config: {
        url: '/test',
        method: 'post',
        headers: {},
      },
    } as AxiosResponse;
  }
  return error;
};

describe('handleError utilities', () => {
  const mockSwalErrorDefaultFire = vi.mocked(swalModule.swalErrorDefault.fire);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleAxiosError', () => {
    test('should call swalErrorDefault.fire with error message from response data', () => {
      const errorMessage = 'Validation failed';
      const axiosError = createMockAxiosError({
        message: errorMessage,
      });

      handleAxiosError(axiosError);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        title: 'Unprocessable Content',
        text: errorMessage,
      });
    });

    test('should use fallback message when error response data message is not available', () => {
      const fallbackMessage = 'Custom fallback message';
      const axiosError = createMockAxiosError({});

      handleAxiosError(axiosError, fallbackMessage);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        title: 'Unprocessable Content',
        text: fallbackMessage,
      });
    });

    test('should use default fallback message when no custom fallback is provided', () => {
      const axiosError = createMockAxiosError(null);

      handleAxiosError(axiosError);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        title: 'Unprocessable Content',
        text: 'An error occurred',
      });
    });

    test('should handle error without response property', () => {
      const axiosError = new AxiosError('Test error');

      handleAxiosError(axiosError);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        title: 'Unprocessable Content',
        text: 'An error occurred',
      });
    });

    test('should handle error with null response', () => {
      const axiosError = new AxiosError('Test error');
      axiosError.response = undefined;

      handleAxiosError(axiosError);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        title: 'Unprocessable Content',
        text: 'An error occurred',
      });
    });

    test('should handle error response data as string', () => {
      const axiosError = createMockAxiosError('String error message');

      handleAxiosError(axiosError);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        title: 'Unprocessable Content',
        text: 'An error occurred',
      });
    });
  });

  describe('handleGenericError', () => {
    test('should call swalErrorDefault.fire with error message from response data', () => {
      const errorMessage = 'Generic error occurred';
      const axiosError = createMockAxiosError({
        message: errorMessage,
      });

      handleGenericError(axiosError);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        text: errorMessage,
      });
    });

    test('should use custom message when error response data message is not available', () => {
      const customMessage = 'Custom error message';
      const axiosError = createMockAxiosError({});

      handleGenericError(axiosError, customMessage);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        text: customMessage,
      });
    });

    test('should use default message when no custom message is provided', () => {
      const axiosError = createMockAxiosError(null);

      handleGenericError(axiosError);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        text: 'An error occurred',
      });
    });

    test('should handle error without response property', () => {
      const axiosError = new AxiosError('Test error');

      handleGenericError(axiosError);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        text: 'An error occurred',
      });
    });

    test('should handle error with undefined response data', () => {
      const axiosError = createMockAxiosError(undefined);

      handleGenericError(axiosError);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        text: 'An error occurred',
      });
    });
  });

  describe('handleApiError', () => {
    test('should call handleAxiosError when response is an AxiosError instance', () => {
      const errorMessage = 'API error occurred';
      const axiosError = createMockAxiosError({
        message: errorMessage,
      });

      handleApiError(axiosError);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        title: 'Unprocessable Content',
        text: errorMessage,
      });
    });

    test('should call handleAxiosError with custom fallback message', () => {
      const customFallback = 'Custom API error message';
      const axiosError = createMockAxiosError({});

      handleApiError(axiosError, customFallback);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        title: 'Unprocessable Content',
        text: customFallback,
      });
    });

    test('should call handleGenericError when response is not an AxiosError instance', () => {
      const errorMessage = 'Generic API error';
      const genericError = {
        response: {
          data: {
            message: errorMessage,
          },
        },
      } as AxiosError;

      handleApiError(genericError);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        text: errorMessage,
      });
    });

    test('should call handleGenericError with default fallback message for non-AxiosError', () => {
      const genericError = {
        response: {
          data: {},
        },
      } as AxiosError;

      handleApiError(genericError);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        text: 'Failed to update data.',
      });
    });

    test('should handle plain object error without response property', () => {
      const genericError = {};

      handleApiError(genericError);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        text: 'Failed to update data.',
      });
    });

    test('should handle null or undefined response', () => {
      handleApiError(null);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        text: 'Failed to update data.',
      });

      vi.clearAllMocks();

      handleApiError(undefined);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        text: 'Failed to update data.',
      });
    });

    test('should handle string response', () => {
      const stringError = 'String error';

      handleApiError(stringError);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        text: 'Failed to update data.',
      });
    });

    test('should handle number response', () => {
      const numberError = 500;

      handleApiError(numberError);

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        text: 'Failed to update data.',
      });
    });
  });

  describe('Integration tests', () => {
    test('should handle complex AxiosError object correctly', () => {
      const complexError = new AxiosError('Request failed');
      complexError.response = {
        status: 422,
        statusText: 'Unprocessable Entity',
        data: {
          message: 'Validation failed',
          errors: {
            email: ['Email is required'],
            password: ['Password must be at least 8 characters'],
          },
        },
        headers: {},
        config: {
          url: '/test',
          method: 'post',
          headers: {},
        },
      } as AxiosResponse;

      handleApiError(complexError, 'Custom fallback');

      expect(mockSwalErrorDefaultFire).toHaveBeenCalledWith({
        title: 'Unprocessable Content',
        text: 'Validation failed',
      });
    });

    test('should maintain function signature consistency', () => {
      // Test that all functions can be called with their expected parameters
      const axiosError = new AxiosError('Test');

      expect(() => handleAxiosError(axiosError)).not.toThrow();
      expect(() => handleAxiosError(axiosError, 'custom message')).not.toThrow();
      expect(() => handleGenericError(axiosError)).not.toThrow();
      expect(() => handleGenericError(axiosError, 'custom message')).not.toThrow();
      expect(() => handleApiError(axiosError)).not.toThrow();
      expect(() => handleApiError(axiosError, 'custom message')).not.toThrow();
    });
  });
});
