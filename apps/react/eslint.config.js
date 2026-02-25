import base from '../../eslint.config.js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  ...base,
  {
    files: ['**/*.{ts,tsx}'],
    ...reactHooks.configs['flat/recommended'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    ...reactRefresh.configs.vite,
  },
]
