export const common = {
  // Defer all formatting concerns to Prettier to avoid conflicts
  // and keep ESLint focused on code-quality rules.
  semi: 'off',
  'no-extra-semi': 'off',
  // Enforce deterministic import ordering across JS/TS/Vue
  'import/order': [
    'error',
    {
      groups: [
        'builtin',
        'external',
        'internal',
        ['parent', 'sibling'],
        'index',
        'type',
      ],
      'newlines-between': 'always',
      pathGroups: [
        {
          pattern: 'vue',
          group: 'external',
          position: 'before',
        },
        {
          pattern: '@vue/**',
          group: 'external',
          position: 'before',
        },
        {
          pattern: 'pinia',
          group: 'external',
          position: 'after',
        },
        {
          pattern: 'quasar',
          group: 'external',
          position: 'after',
        },
        {
          pattern: '@quasar/**',
          group: 'external',
          position: 'after',
        },
        {
          pattern: 'src/**',
          group: 'internal',
          position: 'before',
        },
        {
          pattern: './**',
          group: 'sibling',
          position: 'after',
        },
      ],
      pathGroupsExcludedImportTypes: ['builtin'],
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    },
  ],

  // Keep a blank line after the last import group
  'import/newline-after-import': ['error', { count: 1 }],

  // Sort named import members without reordering whole declarations.
  // This complements import/order and works in .js, .ts, and <script> in .vue.
  'sort-imports': [
    'error',
    {
      ignoreCase: true,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      allowSeparatedGroups: false,
    },
  ],

  'import/no-unresolved': ['off'],
  // Formatting handled by Prettier
  'comma-dangle': 'off',

  // https://eslint.org/docs/latest/rules/indent#rule-details
  indent: 'off',

  'no-console': ['warn', { allow: ['warn', 'error'] }],
  'arrow-parens': 'off',
  curly: 'error',
  'object-shorthand': ['error', 'always'],

  'array-bracket-spacing': 'off',
  'object-curly-spacing': 'off',

  eqeqeq: ['error', 'smart'],
  'prefer-promise-reject-errors': 'error',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-useless-constructor': 'off',
  'no-shadow': 'off',
  'no-var': ['error'],
  'prefer-const': ['error', { destructuring: 'all' }],
  'no-unused-expressions': [
    'error',
    { allowShortCircuit: true, allowTernary: true },
  ],
  'no-param-reassign': ['error', { props: false }],

  'prefer-destructuring': [
    'warn',
    {
      array: false,
      object: true,
    },
    {
      enforceForRenamedProperties: false,
    },
  ],
  'prefer-template': 'warn',
  'template-curly-spacing': 'off',

  quotes: 'off',

  'lines-between-class-members': 'off',
  'no-multiple-empty-lines': 'off',
}
