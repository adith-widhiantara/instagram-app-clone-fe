import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    reporters: ['vitest-sonar-reporter', 'default'],
    outputFile: {
      'vitest-sonar-reporter': 'sonar-report.xml',
    },
    coverage: {
      enabled: true,
      reportOnFailure: true,
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: [
        'src/api/**/*.ts',
        'src/pages/**/*.{ts,tsx}',
        'src/features/**/*.{ts,tsx}',
        'src/components/**/*.{ts,tsx}',
        'src/layouts/**/*.{ts,tsx}',
        'src/utils/**/*.{ts,tsx}',
      ],
      reportsDirectory: './coverage',
    },
    testTimeout: 60000,
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
});
