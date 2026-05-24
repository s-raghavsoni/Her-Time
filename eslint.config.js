import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

/** Root config — workspace packages have their own eslint.config.js */
export default [
  { ignores: ['**/node_modules/**', '**/dist/**', '**/build/**'] },
  js.configs.recommended,
  eslintConfigPrettier,
];
