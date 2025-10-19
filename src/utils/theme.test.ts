// theme.test.ts
import { describe, expect, it, vi } from 'vitest';

// mock alurkerja-ui so we control themeConfig + Theme
vi.mock('alurkerja-ui', () => ({
  themeConfig: { colors: { primary: '#123456' }, font: 'Inter' },
  Theme: {}, // not used at runtime, just for typing
}));

import { theme } from './theme';

describe('theme', () => {
  it('spreads themeConfig into theme export', () => {
    expect(theme).toBeDefined();
    expect(theme).toHaveProperty('colors');
    expect(theme).toHaveProperty('font', 'Inter');
  });
});
