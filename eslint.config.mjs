import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/vite.config.*.timestamp*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            // Apps can only depend on libs (not other apps)
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:types',
                'type:util',
                'type:ui',
                'type:domain',
                'type:constants',
              ],
            },
            // BFFs can only depend on libs (not other apps or services)
            {
              sourceTag: 'type:bff',
              onlyDependOnLibsWithTags: [
                'type:types',
                'type:util',
                'type:domain',
                'type:constants',
                'type:grpc',
              ],
            },
            // Services can only depend on libs
            {
              sourceTag: 'type:service',
              onlyDependOnLibsWithTags: [
                'type:types',
                'type:util',
                'type:domain',
                'type:constants',
                'type:grpc',
              ],
            },
            // Util libs can only depend on types/constants (no domain, no ui)
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:types', 'type:constants'],
            },
            // UI libs can only depend on types/util/constants (no domain)
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: [
                'type:types',
                'type:util',
                'type:constants',
              ],
            },
            // Scope isolation: admin cannot depend on customer-scoped libs
            {
              sourceTag: 'scope:admin',
              notDependOnLibsWithTags: ['scope:customer'],
            },
            // Scope isolation: customer cannot depend on admin-scoped libs
            {
              sourceTag: 'scope:customer',
              notDependOnLibsWithTags: ['scope:admin'],
            },
            // Platform isolation: node cannot depend on web-only libs
            {
              sourceTag: 'platform:node',
              notDependOnLibsWithTags: ['platform:web'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
];
