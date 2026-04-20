import { pluginUpdateIcons, pluginUpdateReadmePD } from '@jenesei-software/jenesei-plugin-vite';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import { logger } from './src/cores/logger';
import path, { resolve } from 'node:path';
import process from 'node:process';

export default defineConfig(() => {
  const isStorybook = process.env.NODE_ENV === 'storybook';
  const rollupExternal = [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    '@jenesei-software/jenesei-kit-react',
  ];

  logger.info('isStorybookBuild: ', String(isStorybook));

  const sizesBackgroundTransparent = [57, 64, 72, 76, 114, 120, 144, 152, 180, 192, 256, 384, 512];
  const sizesBackgroundWhite: number[] = [];
  const sizesFavicon = [64];

  return {
    resolve: {
      tsconfigPaths: true,
      alias: {
        '@local': path.resolve(__dirname, './src'),
      },
    },
    css: {
      postcss: {
        plugins: [autoprefixer({})],
      },
    },
    plugins: [
      isStorybook &&
        pluginUpdateIcons({
          pathInputFile: path.resolve(__dirname, '.storybook-public/logos/logo-jenesei-kit-react.png'),
          pathOutputDirectory: path.resolve(__dirname, '.storybook-public/icons'),
          prefix: 'icon',
          sizesBackgroundTransparent: sizesBackgroundTransparent,
          sizesBackgroundWhite: sizesBackgroundWhite,
          sizesFavicon: sizesFavicon,
        }),
      isStorybook &&
        pluginUpdateReadmePD({
          insertionPoint: '# IMPORTANT',
          pathReadme: resolve(__dirname, 'README.md'),
          pathPackageJson: resolve(__dirname, 'package.json'),
        }),
      react(),
      !isStorybook &&
        dts({
          tsconfigPath: './tsconfig.build.json',
          outDir: './build',
          entryRoot: './src',
          compilerOptions: {
            rootDir: './src',
          },
          insertTypesEntry: true,
          logLevel: 'info',
        }),
    ].filter(Boolean),
    publicDir: false,
    build: {
      sourcemap: true,
      outDir: './build',
      rootDir: './src',
      minify: 'esbuild',
      lib: !isStorybook
        ? {
            cssFileName: 'styles',
            entry: {
              index: resolve(__dirname, 'src/index.ts'),
              'component-test': resolve(__dirname, 'src/components/test/index.ts'),
            },
            formats: ['es', 'cjs'],
            fileName: (format, name) => `${name}.${format}.js`,
          }
        : false,
      rollupOptions: {
        external: (id) =>
          ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'].includes(id) ||
          id === '@jenesei-software/jenesei-kit-react' ||
          id.startsWith('@jenesei-software/jenesei-kit-react/'),
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
    },
  };
});
