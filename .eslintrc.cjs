const { resolve, } = require('node:path')

const rules = require('./rules/eslint')

// https://quasar.dev/quasar-cli-vite/supporting-ts

module.exports = {
  root: true,

  parserOptions: {
    extraFileExtensions: [ '.vue', ],
    parser: '@typescript-eslint/parser',
    project: resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest', // Allows for the parsing of modern ECMAScript features
    sourceType: 'module',
  },

  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
  ],

  env: {
    browser: true,
    es2023: true,
    node: true,
    'vue/setup-compiler-macros': true,
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-strongly-recommended',
  ],

  plugins: [
    '@typescript-eslint',
    'import',
    'vue',
  ],

  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly',
  },

  // add your custom rules here
  rules,
}
