export const vueAttributes = {
  'vue/attributes-order': [
    'error',
    {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        ['UNIQUE', 'SLOT'],
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'ATTR_DYNAMIC',
        'ATTR_STATIC',
        'ATTR_SHORTHAND_BOOL',
        'EVENTS',
        'CONTENT',
      ],
      alphabetical: true,
    },
  ],

  'vue/attribute-hyphenation': [
    'error',
    'always',
    {
      ignore: [],
    },
  ],

  'vue/prop-name-casing': ['error', 'camelCase'],

  // Ensure attributes are sorted within a single line when Prettier keeps them
  // on the same line. This complements vue/max-attributes-per-line.
  'vue/sort-keys': [
    'off',
    'asc',
    {
      natural: true,
      caseSensitive: false,
      minKeys: 2,
    },
  ],
}
