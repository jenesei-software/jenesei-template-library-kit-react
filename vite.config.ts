import react from '@vitejs/plugin-react'
import path, { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

import { peerDependencies } from './package.json'

export default defineConfig(() => {
  // eslint-disable-next-line no-undef
  const isStorybookBuild = process.env.BUILD_STORYBOOK === 'true'

  return {
    resolve: {
      alias: {
        // eslint-disable-next-line no-undef
        '@local': path.resolve(__dirname, './src')
      }
    },
    plugins: [
      react(),
      tsconfigPaths(),
      !isStorybookBuild &&
        dts({
          include: ['src/'],
          exclude: ['src/declaration/jenesei-ui-react.d.ts'],
          rollupTypes: true,
          insertTypesEntry: true,
          tsconfigPath: './tsconfig.json'
        })
    ].filter(Boolean),
    publicDir: false,
    build: {
      sourcemap: true,
      outDir: './dist',
      rootDir: './src',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      lib: {
        // eslint-disable-next-line no-undef
        entry: resolve(__dirname, 'src/main.ts'),
        name: 'library-name',
        formats: ['es', 'umd'],
        fileName: format => `library-name.${format}.js`
      },
      rollupOptions: {
        external: Object.keys(peerDependencies),
        output: {
          globals: {
            'styled-components': 'styled',
            'styled-reset': 'reset',
            react: 'React',
            'react-dom': 'ReactDOM',
            '@jenesei-software/jenesei-ui-react': 'jeneseiUiReact'
          }
        }
      }
    }
  }
})
