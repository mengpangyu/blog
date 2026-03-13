import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      'docs/.vitepress/cache/**',
      'docs/.vitepress/dist/**',

      // Vue language-tools virtual output (can appear as *.vue.js in some setups)
      'apps/vue/**/*.vue.*',

      // Legacy demo scripts from notes migration (learning code, not production)
      'apps/js/**',
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['**/*.{js,cjs,mjs,ts,tsx,mts,cts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Exclude Vue language-tools virtual output (e.g. *.vue.js) from linting.
  {
    files: ['apps/vue/**/*'],
    ignores: ['**/*.vue.*'],
  },

  // Keep Prettier as the single source of formatting truth.
  prettier,
]
