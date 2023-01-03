import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    'https://graphqlzero.almansi.me/api',
    'https://snowtooth.moonhighway.com/',
  ],
  documents: 'src/graphql/**/*.graphql',
  generates: {
    'src/services/generated-api/index.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        avoidOptionals: true,
        scalars: {
          Upload: 'File',
        },
      },
    },
    'src/services/generated-api/schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
  hooks: {
    afterAllFileWrite: 'prettier --write',
  },
};

export default config;
