module.exports = {
  extends: [
    'stylelint-config-html',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-recess-order',
    'stylelint-config-standard',
  ],
  rules: {
    'annotation-no-unknown': [true, { ignoreAnnotations: [ "default"] }],
    'scss/at-rule-no-unknown': [true],
    'alpha-value-notation': 'number',
    'string-quotes': 'double',
    'string-no-newline': null,
    'selector-max-universal': 1,
    'selector-max-type': [0, { ignore: ['child', 'descendant', 'compounded'] }],
    'max-nesting-depth': [
      7,
      {
        ignore: ['pseudo-classes', 'blockless-at-rules'],
        ignoreAtRules: ['media'],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'export', 'import', 'local'],
      },
    ],
    'selector-class-pattern': '',
    'import-notation': 'string'
  },
  overrides: [
    {
      files: ['src/*.vue', 'src/**/*.vue', 'src/*.scss', 'src/**/*.scss'],
      rules: {
        'rule-empty-line-before': 'always-multi-line',
        'unit-allowed-list': [
          'em',
          'rem',
          'ms',
          's',
          '%',
          'px',
          'fr',
          'vw',
          'vh',
          'deg',
        ],
      },
    },
  ],
}
