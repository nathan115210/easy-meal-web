// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  // Global ignores (applies to every config)
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    '.idea/**',
    'public/**', // Next.js outputs static assets here
    'database/**/*.db',
    'next-env.d.ts',
  ]),

  // Next.js presets (flat exports)
  ...nextVitals,
  ...nextTs,

  // Turn off rules that conflict with Prettier
  eslintConfigPrettier,

  // Your project rules
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { ignoreRestSiblings: true, varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
    },
  },
  // Per-file override
  {
    files: ['src/lib/utils/filterMeals.ts'],
    rules: { '@typescript-eslint/no-unused-vars': 'off' },
  },
]);
