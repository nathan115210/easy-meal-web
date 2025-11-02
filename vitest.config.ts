import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: {
      // SCSS modules “just work”; this keeps class names readable in tests
      modules: { classNameStrategy: 'non-scoped' },
    },
    coverage: {
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
    },
  },
});
