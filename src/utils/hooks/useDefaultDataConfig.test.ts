import { describe, test, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDefaultDataConfig } from './useDefaultDataConfig';
import type { DataConfig } from './useDefaultDataConfig';

describe('useDefaultDataConfig', () => {
  beforeEach(() => {
    // No mocks needed for this simple hook test
  });

  test('should return default configuration when no additional config is provided', () => {
    const { result } = renderHook(() => useDefaultDataConfig());

    expect(result.current.dataConfig).toEqual({
      limit: 10,
      page: 0,
      direction: 'desc',
      sort: 'created_at',
    });
    expect(typeof result.current.setDataConfig).toBe('function');
  });

  test('should merge additional configuration with default values', () => {
    const additionalConfig = {
      limit: 20,
      customField: 'custom-value',
      sort: 'updated_at',
    };

    const { result } = renderHook(() => useDefaultDataConfig(additionalConfig));

    expect(result.current.dataConfig).toEqual({
      limit: 20,
      page: 0,
      direction: 'desc',
      sort: 'updated_at',
      customField: 'custom-value',
    });
  });

  test('should override default values with additional configuration', () => {
    const additionalConfig = {
      page: 5,
      direction: 'desc' as const,
      limit: 50,
    };

    const { result } = renderHook(() => useDefaultDataConfig(additionalConfig));

    expect(result.current.dataConfig).toEqual({
      limit: 50,
      page: 5,
      direction: 'desc',
      sort: 'created_at',
    });
  });

  test('should handle empty additional configuration object', () => {
    const { result } = renderHook(() => useDefaultDataConfig({}));

    expect(result.current.dataConfig).toEqual({
      limit: 10,
      page: 0,
      direction: 'desc',
      sort: 'created_at',
    });
  });

  test('should allow updating data configuration through setDataConfig', () => {
    const { result } = renderHook(() => useDefaultDataConfig());

    act(() => {
      result.current.setDataConfig({
        limit: 25,
        page: 2,
        direction: 'desc',
        sort: 'name',
      });
    });

    expect(result.current.dataConfig).toEqual({
      limit: 25,
      page: 2,
      direction: 'desc',
      sort: 'name',
    });
  });

  test('should allow partial updates through setDataConfig with function', () => {
    const { result } = renderHook(() => useDefaultDataConfig());

    act(() => {
      result.current.setDataConfig(prev => ({
        ...prev,
        page: 3,
        limit: 15,
      }));
    });

    expect(result.current.dataConfig).toEqual({
      limit: 15,
      page: 3,
      direction: 'desc',
      sort: 'created_at',
    });
  });

  test('should handle additional string and number configuration values', () => {
    const additionalConfig = {
      search: 'test-search',
      offset: 100,
      timeout: 5000,
      filter: 'active',
    };

    const { result } = renderHook(() => useDefaultDataConfig(additionalConfig));

    expect(result.current.dataConfig).toEqual({
      limit: 10,
      page: 0,
      direction: 'desc',
      sort: 'created_at',
      search: 'test-search',
      offset: 100,
      timeout: 5000,
      filter: 'active',
    });
  });

  test('should handle undefined values in additional configuration', () => {
    const additionalConfig = {
      limit: 20,
      undefinedField: undefined,
      validField: 'valid-value',
    };

    const { result } = renderHook(() => useDefaultDataConfig(additionalConfig));

    expect(result.current.dataConfig).toEqual({
      limit: 20,
      page: 0,
      direction: 'desc',
      sort: 'created_at',
      undefinedField: undefined,
      validField: 'valid-value',
    });
  });

  test('should maintain proper TypeScript types', () => {
    const { result } = renderHook(() => useDefaultDataConfig());

    // Test that the returned types match the expected interface
    const dataConfig: DataConfig = result.current.dataConfig;
    const setDataConfig: React.Dispatch<React.SetStateAction<DataConfig>> = result.current.setDataConfig;

    expect(dataConfig.limit).toBeTypeOf('number');
    expect(dataConfig.page).toBeTypeOf('number');
    expect(['asc', 'desc']).toContain(dataConfig.direction);
    expect(dataConfig.sort).toBeTypeOf('string');
    expect(setDataConfig).toBeTypeOf('function');
  });

  test('should re-render with updated configuration when dependencies change', () => {
    let additionalConfig = { limit: 10 };
    const { result, rerender } = renderHook(({ config }) => useDefaultDataConfig(config), {
      initialProps: { config: additionalConfig },
    });

    expect(result.current.dataConfig.limit).toBe(10);

    // Update the config and rerender
    additionalConfig = { limit: 30 };
    rerender({ config: additionalConfig });

    // The hook should still use the initial configuration (useState initializer is only called once)
    expect(result.current.dataConfig.limit).toBe(10);
  });

  test('should work correctly with different sort directions', () => {
    const ascConfig = { direction: 'asc' as const };
    const descConfig = { direction: 'desc' as const };

    const { result: ascResult } = renderHook(() => useDefaultDataConfig(ascConfig));
    const { result: descResult } = renderHook(() => useDefaultDataConfig(descConfig));

    expect(ascResult.current.dataConfig.direction).toBe('asc');
    expect(descResult.current.dataConfig.direction).toBe('desc');
  });
});
