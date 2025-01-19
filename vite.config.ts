/* eslint-disable no-undef */
import react from '@vitejs/plugin-react'
import path, { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

import { peerDependencies } from './package.json'

export default defineConfig(() => {
  const isStorybook = process.env.NODE_ENV === 'storybook'
  const isDev = process.env.NODE_ENV === 'dev'

  console.log('isStorybookBuild: ', String(isStorybook))
  console.log('isDev: ', String(isDev))

  return {
    resolve: {
      alias: {
        '@local': path.resolve(__dirname, './src')
      }
    },
    plugins: [
      react(),
      tsconfigPaths(),
      isDev &&
        visualizer({
          open: true,
          filename: 'stats.html',
          gzipSize: true,
          brotliSize: true
        }),
      !isStorybook &&
        dts({
          include: ['src/'],
          exclude: ['src/declaration/jenesei-ui-react.d.ts', 'src/declaration/styled-components.d.ts'],
          rollupTypes: true,
          insertTypesEntry: true,
          tsconfigPath: './tsconfig.json'
        })
    ].filter(Boolean),
    publicDir: false,
    build: {
      sourcemap: true,
      outDir: './build',
      rootDir: './src',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      lib: {
        entry: {
          main: resolve(__dirname, 'src/main.ts'),

          ['component-test']: resolve(__dirname, 'src/components/test/index.ts')
        },
        formats: ['es', 'cjs'],
        fileName: (format, name) => `${name}.${format}.js`
      },
      rollupOptions: {
        external: Object.keys(peerDependencies),
        output: {
          globals: {
            'styled-components': 'styled',
            'styled-reset': 'reset',
            react: 'React',
            'react-dom': 'ReactDOM',
            '@jenesei-software/jenesei-ui-react': 'jeneseiUiReact',
            'react-helmet-async': 'reactHelmetAsync'
          }
        }
      }
    }
  }
})
