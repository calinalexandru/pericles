module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    // 'plugin:prettier/recommended',
    'prettier',
    'plugin:security/recommended',
    'plugin:sonarjs/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'react-hooks',
    'prettier',
    'security',
    'react-perf',
    'sonarjs',
    '@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: 'tsconfig.json',
  },
  env: {
    browser: true,
  },

  // eslint-import-resolver-webpack plugin
  // enable solving paths using webpack config
  // NOTE:: tables webpack.config.js as default
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      node: {
        paths: ['src'],
      },
    },
  },
  rules: {
    // 'prettier/prettier': [
    //   'error',
    //   {
    //     printWidth: 100,
    //     tabWidth: 2,
    //     useTabs: false,
    //     semi: true,
    //     singleQuote: true,
    //     trailingComma: 'es5',
    //     bracketSpacing: true,
    //     jsxBracketSameLine: false,
    //     arrowParens: 'always',
    //     endOfLine: 'lf',
    //   },
    // ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '{@/**,@pericles/**}',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: [],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    // force indentation to 2 spaces
    indent: ['error', 2],

    //
    // 'prettier/prettier': 'error',
    // 'prettier/prettier': [
    //   'error',
    //   {
    //     printWidth: 120,
    //     tabWidth: 2,
    //     useTabs: false,
    //     semi: true,
    //     singleQuote: true,
    //     trailingComma: 'es5',
    //     bracketSpacing: true,
    //     jsxBracketSameLine: false,
    //     arrowParens: 'always',
    //     endOfLine: 'lf',
    //   },
    // ],

    // enforce adding trailing comma
    'comma-dangle': [
      'error',
      {
        arrays: 'always',
        objects: 'always',
        imports: 'always',
        exports: 'always',
        functions: 'never',
      },
    ],

    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],

    // requires parens around arguments in all cases (arrow functions)
    'arrow-parens': ['error', 'always'],

    // enforces no braces where they can be omitted
    'arrow-body-style': ['error', 'as-needed'],

    // force camlecase checking
    camelcase: ['error', { properties: 'always' }],

    // make sure we use standart break line style, currently 'CRLF' for windows
    'linebreak-style': ['error', 'unix'],

    // requires blockes not to be padded by line break
    // only classes must use line break padded
    'padded-blocks': ['error', { blocks: 'never', classes: 'always', switches: 'never' }],

    // limit code line length and comments line length
    'max-len': ['error', { code: 120, comments: 150 }],

    // allow the use ++ and -- operators
    'no-plusplus': 'off',

    // requires line breaks if there are line breaks inside properties or between properties
    'object-curly-newline': [
      'error',
      {
        ImportDeclaration: { multiline: true, minProperties: 4 },
      },
    ],

    // require spacing in array brackets
    'array-bracket-spacing': ['error', 'always'],

    // enable re-assigning params in functions
    'no-param-reassign': ['off'],

    // enable all js features
    'no-restricted-syntax': ['off'],

    // enable multi assignments (chain)
    'no-multi-assign': ['off'],

    // TEMP:: turn off restricting global variables
    // TODO:: check if there are specific vars we want to turn of for compatibility
    'no-restricted-globals': ['off'],

    // disable iterator restriction
    'no-iterator': ['off'],

    // disable restriction of using Object.protptype methods
    'no-prototype-builtins': ['off'],

    // turn off disallowing empty objects
    'no-empty': ['off'],

    'no-multiple-empty-lines': 'error',

    // allow dangling underscore
    'no-underscore-dangle': ['off'],

    // allow nested ternary
    'no-nested-ternary': ['off'],

    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],

    // allow ShortCircuit
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],

    // allow using different types of export, don't force default export
    'import/prefer-default-export': ['off'],

    'import/no-extraneous-dependencies': ['off'],

    // disable forcing to accompany "onClick" with keyboard events
    'jsx-a11y/click-events-have-key-events': ['off'],

    // turn off forcing the use of "role" attr in html tags with event handlers
    'jsx-a11y/no-static-element-interactions': ['off'],

    // turn off forcing handlers only for "interactive" components (buttons, selects, ...)
    'jsx-a11y/no-noninteractive-element-interactions': ['off'],

    // disable forcing "alt" attr on images
    'jsx-a11y/alt-text': ['off'],

    // disable forcing mouseover/out to be accompanied by focus/blur events
    'jsx-a11y/mouse-events-have-key-events': ['off'],

    // set unused proptype linting to "warn" since it has issues when used in different ways
    // https://github.com/yannickcr/eslint-plugin-react/issues/885
    // TODO:: check if there is a workaround/
    'react/no-unused-prop-types': ['warn', {}],

    // force indentation to 2 spaces to jsx
    'react/jsx-indent': ['error', 2],

    // force indentation to 2 spaces to props
    'react/jsx-indent-props': ['error', 2],

    // force to use "true" for boolean values instead of omitting them (omit = true)
    'react/jsx-boolean-value': ['error', 'always'],

    // force adding "key" attr to components if needed
    'react/jsx-key': ['error'],

    // force no props spreading off for now, we should revisit this in the future
    'react/jsx-props-no-spreading': ['off'],

    'react/function-component-definition': ['off'],

    // forbid the use of these proptypes to enhance props readability
    // NOTE:: omitting the "object" and "array" restriction because we use big objects like table
    'react/forbid-prop-types': [
      'error',
      {
        forbid: ['any'],
        checkContextTypes: true,
        checkChildContextTypes: true,
      },
    ],

    'react/jsx-max-props-per-line': [1, { maximum: 1 }],

    'react/jsx-first-prop-new-line': [1, 'multiline-multiprop'],

    'react/destructuring-assignment': ['off'],

    'react/prop-types': [2, { ignore: ['children', 'className', 'id'] }],

    // disable forcing any non-required PropType declaration
    // of a component has a corresponding defaultProps value
    'react/require-default-props': ['off'],

    // disable forbidding use of "dangerouslySetInnerHTML" (we use it for SVG manipulation)
    // TODO:: think about creating HOC to handle
    // TODO::  all dangerouslySetInnerHTML and it will override the lint rule
    'react/no-danger': ['off'],

    'react/no-array-index-key': ['off'],

    // force composition of class functions and parameters to be in this order:
    'react/sort-comp': [
      'error',
      {
        order: [
          'static-methods',
          'instance-variables',
          'lifecycle',
          '/^on.+$/',
          'everything-else',
          'rendering',
        ],
      },
    ],

    // enable jsx in both .js and .jsx files
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],

    // react hooks errors
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',

    // security and performance
    'security/detect-object-injection': 'error',
    'react-perf/jsx-no-new-object-as-prop': 'error',
    'react-perf/jsx-no-new-array-as-prop': 'error',
    'react-perf/jsx-no-jsx-as-prop': 'error',
    'sonarjs/no-duplicate-string': 'error',
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/cognitive-complexity': ['error', 15],
  },
};
