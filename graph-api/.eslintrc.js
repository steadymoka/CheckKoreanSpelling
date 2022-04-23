module.exports = {
  env: {
    jest: true,
  },
  ignorePatterns: [
    'node_modules/',
  ],
  overrides: [
    {
      files: [
        '**/*.ts',
      ],
      extends: [
        'stable',
        'stable/typescript',
      ],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
      rules: {
        '@typescript-eslint/ban-types': ['error', {
          types: {
            Function: false,
          },
          extendDefaults: true,
        }],
        'no-console': 'off',
        'complexity': 'off',
        'no-redeclare': 'off',
        '@typescript-eslint/no-extra-parens': 'off',
        '@typescript-eslint/no-redeclare': ['error'],
        'generator-star-spacing': ['error', { before: false, after: true }],
      },
    },
    {
      files: [
        '**/*.js',
      ],
      extends: [
        'stable',
      ],
    },
  ],
}
