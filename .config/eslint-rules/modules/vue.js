export const vue = {
  'vue/v-on-event-hyphenation': ['error', 'always', { autofix: true }],
  'vue/component-name-in-template-casing': [
    'error',
    'PascalCase',
    {
      registeredComponentsOnly: true,
      ignores: [],
    },
  ],

  'vue/no-multiple-template-root': 'off',
  'vue/padding-line-between-blocks': ['error', 'always'],

  'vue/html-self-closing': [
    'error',
    {
      html: { void: 'always', normal: 'always', component: 'always' },
      svg: 'always',
      math: 'always',
    },
  ],
  'vue/max-attributes-per-line': [
    'error',
    {
      singleline: 1,
      multiline: 1,
    },
  ],
  'vue/first-attribute-linebreak': [
    'error',
    {
      singleline: 'ignore',
      multiline: 'below',
    },
  ],
  'vue/html-closing-bracket-newline': [
    'error',
    {
      singleline: 'never',
      multiline: 'always',
    },
  ],
  'vue/html-indent': [
    'error',
    2,
    {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: false,
      ignores: [],
    },
  ],

  'vue/v-bind-style': ['error', 'shorthand'],
  'vue/v-on-style': ['error', 'shorthand'],

  'vue/require-default-prop': 'error',
  'vue/require-explicit-emits': 'error',
  'vue/no-unused-components': 'error',
  'vue/no-template-shadow': 'error',
  'vue/no-v-html': 'warn',
  'vue/prefer-separate-static-class': 'warn',

  'vue/order-in-components': [
    'error',
    {
      order: [
        'el',
        'name',
        'key',
        'parent',
        'functional',
        ['delimiters', 'comments'],
        ['components', 'directives', 'filters'],
        'extends',
        'mixins',
        ['provide', 'inject'],
        'ROUTER_GUARDS',
        'layout',
        'middleware',
        'validate',
        'scrollToTop',
        'transition',
        'loading',
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        'emits',
        'setup',
        'asyncData',
        'data',
        'fetch',
        'head',
        'computed',
        'watch',
        'watchQuery',
        'LIFECYCLE_HOOKS',
        'methods',
        ['template', 'render'],
        'renderError',
      ],
    },
  ],

  'vue/block-tag-newline': [
    'error',
    {
      singleline: 'consistent',
      multiline: 'consistent',
      maxEmptyLines: 0,
    },
  ],

  'vue/block-order': [
    'error',
    {
      order: ['script', 'template', 'style'],
    },
  ],

  'vue/script-indent': 'off',
  'vue/singleline-html-element-content-newline': 'off',
  'vue/html-closing-bracket-spacing': 'off',
  'vue/multiline-html-element-content-newline': 'off',
}
