import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
    },
  },
  ...compat
    .extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@angular-eslint/recommended',
      'plugin:@angular-eslint/template/process-inline-templates',
    )
    .map(config => ({
      ...config,
      files: ['**/*.ts'],
    })),
  {
    files: ['**/*.ts'],

    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-async-promise-executor': 'warn',
      'no-useless-escape': 'warn',
      'no-var': 'warn',
      'prefer-const': 'warn',
      'no-dupe-else-if': 'warn',

      '@angular-eslint/directive-selector': [
        'warn',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],

      '@angular-eslint/component-selector': [
        'warn',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  ...compat
    .extends(
      'plugin:@angular-eslint/template/recommended',
      'plugin:@angular-eslint/template/accessibility',
    )
    .map(config => ({
      ...config,
      files: ['**/*.html'],
    })),
  {
    files: ['**/*.html'],
    rules: {},
  },
];
