import { pluginUpdateIcons, pluginUpdateReadmePD } from '@jenesei-software/jenesei-plugin-vite';
import react from '@vitejs/plugin-react';
import path, { resolve } from 'path';
import process from 'process';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

import { peerDependencies } from './package.json';

export default defineConfig(() => {
  const isStorybook = process.env.NODE_ENV === 'storybook';

  console.log('isStorybookBuild: ', String(isStorybook));

  const sizesBackgroundTransparent = [57, 64, 72, 76, 114, 120, 144, 152, 180, 192, 256, 384, 512];
  const sizesBackgroundWhite = [];
  const sizesFavicon = [64];

  return {
    resolve: {
      alias: {
        '@local': path.resolve(__dirname, './src'),
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
      pluginUpdateReadmePD({
        insertionPoint: '# IMPORTANT',
        pathReadme: resolve(__dirname, 'README.md'),
        pathPackageJson: resolve(__dirname, 'package.json'),
      }),
      react(),
      tsconfigPaths(),
      !isStorybook &&
        dts({
          include: ['src/'],
          rollupTypes: true,
          insertTypesEntry: true,
          tsconfigPath: './tsconfig.json',
        }),
    ].filter(Boolean),
    publicDir: false,
    build: {
      sourcemap: true,
      outDir: './build',
      rootDir: './src',
      minify: 'terser',
      lib: {
        entry: {
          index: resolve(__dirname, 'src/index.ts'),
          ['example']: resolve(__dirname, 'src/example/index.ts'),
        },
        formats: ['es', 'cjs'],
        fileName: (format, name) => `${name}.${format}.js`,
      },
      rollupOptions: {
        external: Object.keys(peerDependencies),
        output: {
          globals: {
            'styled-components': 'styled',
            'styled-reset': 'reset',
            react: 'React',
            'react-dom': 'ReactDOM',
            moment: 'moment',
            'react-number-format': 'reactNumberFormat',
            '@tanstack/react-virtual': 'reactVirtual',
            'js-cookie': 'Cookies',
            '@tanstack/react-router': 'reactRouter',
          },
        },
      },
    },
  };
});
