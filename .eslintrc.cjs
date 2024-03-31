// https://quasar.dev/quasar-cli-vite/supporting-ts

module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  // https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
  // Must use parserOptions instead of "parser" to allow vue-eslint-parser to keep working
  // `parser: 'vue-eslint-parser'` is already included with any 'plugin:vue/**' config and should be omitted
  parserOptions: {
    parser: require.resolve('@typescript-eslint/parser'),
    extraFileExtensions: [ '.vue', ],
    ecmaVersion: 'latest', // Allows for the parsing of modern ECMAScript features
  },

  env: {
    browser: true,
    es2023: true,
    node: true,
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-strongly-recommended',
    'standard',
  ],

  ignorePatterns: [
    '.quasar',
    'dist',
    'node_modules',
    'tsconfig.json',
    'package.json',
    'package-lock.json',
    'quasar.testing.json',
    'quasar.extensions.json',
  ],

  plugins: [
    '@typescript-eslint',
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
  rules: {
    'import/order': [ 'error', {
      'newlines-between': 'always',
      groups: [
        'builtin', // Built-in imports (come from NodeJS native) go first
        'external', // <- External imports
        'internal', // <- Absolute imports
        [ 'sibling', 'parent', ], // <- Relative imports, the sibling and parent types they can be mingled together
        'index', // <- index imports
        'unknown', // <- unknown
      ],
      pathGroups: [
        { pattern: 'vue**', group: 'external', position: 'before', },
        { pattern: 'pinia', group: 'external', position: 'before', },
        { pattern: 'firebase/**', group: 'external', position: 'before', },
        { pattern: 'http-status-codes', group: 'external', position: 'before', },
        { pattern: 'quasar', group: 'external', position: 'before', },
        { pattern: 'quasar/**', group: 'external', position: 'before', },
        { pattern: 'boot', group: 'external', position: 'before', },
        { pattern: 'types', group: 'external', position: 'before', },
        { pattern: '**/types/**', group: 'external', position: 'before', },
        { pattern: 'routes', group: 'external', position: 'before', },
        { pattern: '**/routes/**', group: 'external', position: 'before', },
        { pattern: 'api', group: 'external', position: 'before', },
        { pattern: '**/services/api/**', group: 'external', position: 'before', },
        { pattern: 'stores', group: 'external', position: 'before', },
        { pattern: '**/stores/**', group: 'external', position: 'before', },
        { pattern: 'utils', group: 'external', position: 'before', },
        { pattern: '**/utils/**', group: 'external', position: 'before', },
        { pattern: 'module', group: 'external', position: 'before', },
        { pattern: '**/components/common/**', group: 'external', position: 'before', },
        { pattern: 'components', group: 'external', position: 'before', },
        { pattern: '**/components/**', group: 'external', position: 'before', },
        { pattern: '^[./]', group: 'internal', position: 'before', },
      ],
      pathGroupsExcludedImportTypes: [ 'vue', ],
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
      distinctGroup: true,
      warnOnUnassignedImports: true,
    }, ],

    'import/no-unresolved': 0,

    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: { var: 2, let: 2, const: 3, },
        MemberExpression: 1,
        FunctionDeclaration: { body: 1, parameters: 2, },
        StaticBlock: { body: 1, },
        CallExpression: { arguments: 1, },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: true,
        offsetTernaryExpressions: true,
      },
    ],

    'no-console': [ 'warn', { allow: [ 'warn', 'error', ], }, ],

    'arrow-parens': [ 'error', 'always', ],

    curly: 'error',

    'comma-dangle': [ 'error', {
      arrays: 'always',
      objects: 'always',
      imports: 'always',
      exports: 'always',
      functions: 'never',
    }, ],

    'array-bracket-spacing': [ 'error', 'always', ],

    eqeqeq: [ 'error', 'smart', ],

    'prefer-promise-reject-errors': 'off',

    quotes: [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: false, },
    ],

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'no-useless-constructor': 'off',

    'no-shadow': 'off',

    'no-var': [ 'error', ],

    'lines-between-class-members': [ 'error', 'always', ],

    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: [ 'return', 'export', 'const', 'let', ],
      },
      { blankLine: 'always', prev: [ 'const', 'let', ], next: '*', },
      {
        blankLine: 'any',
        prev: [ 'const', 'let', ],
        next: [ 'const', 'let', ],
      },
      {
        blankLine: 'always',
        prev: [ 'case', 'default', 'directive', ],
        next: '*',
      },
      { blankLine: 'any', prev: 'directive', next: 'directive', },
    ],

    '@typescript-eslint/comma-dangle': 'off',

    '@typescript-eslint/no-unsafe-call': 'off',

    '@typescript-eslint/no-unsafe-return': 'off',

    '@typescript-eslint/no-unsafe-member-access': 'off',

    '@typescript-eslint/no-unsafe-assignment': 'off',

    '@typescript-eslint/no-shadow': [ 'error', ],

    '@typescript-eslint/no-unused-vars': 'error',

    '@typescript-eslint/restrict-template-expressions': 'off',

    '@typescript-eslint/consistent-type-imports': 'error',

    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true,
      },
    ],

    // to enforce using type for object type definitions, can be type or interface
    '@typescript-eslint/consistent-type-definitions': [ 'error', 'type', ],

    // this rule, if on, would require explicit return type on the `render` function
    '@typescript-eslint/explicit-function-return-type': 'off',

    // in plain CommonJS modules, you can't use `import foo = require('foo')` to pass this rule, so it has to be disabled
    '@typescript-eslint/no-var-requires': 'off',

    '@typescript-eslint/prefer-nullish-coalescing': 'off',

    '@typescript-eslint/strict-boolean-expressions': 'off',

    // https://eslint.vuejs.org/rules/v-on-event-hyphenation.html
    'vue/v-on-event-hyphenation': [
      'error',
      'always',
      {
        autofix: true,
      },
    ],

    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any',
        },
      },
    ],

    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: true,
        ignores: [],
      },
    ],

    'vue/attributes-order': [ 'error', {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        [ 'UNIQUE', 'SLOT', ],
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'ATTR_DYNAMIC',
        'ATTR_STATIC',
        'ATTR_SHORTHAND_BOOL',
        'EVENTS',
        'CONTENT',
      ],
      alphabetical: true,
    }, ],

  },
}
