import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Only run unit tests from src/** and ignore Playwright e2e specs.
    include: ['src/**/*.{spec,test}.{ts,tsx}'],
    exclude: ['e2e/**/*', '**/node_modules/**', '**/dist/**', '**/.next/**'],
    css: {
      // SCSS modules “just work”; this keeps class names readable in tests
      modules: { classNameStrategy: 'non-scoped' },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
    },
  },
});
