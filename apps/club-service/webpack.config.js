const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/club-service'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'swc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      // Bundle ALL deps into main.js EXCEPT the Prisma generated client.
      // .prisma/club-client is generated at build time and copied to /app/.prisma/
      // at runtime — webpack can't bundle it because it doesn't exist in the
      // source tree, only in node_modules/.prisma after `prisma generate` runs.
      externalDependencies: ['.prisma/club-client'],
      sourceMap: true,
      tsPluginOptions: { transpileOnly: true },
    }),
  ],
};
