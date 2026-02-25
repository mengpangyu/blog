import base from '../../eslint.config.js'
import vue from 'eslint-plugin-vue'

export default [
  ...base,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx,js,jsx,vue}'],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.vue'],
      },
    },
  },
]
