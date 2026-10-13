import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'
// eslint-disable-next-line no-restricted-imports
import autoImportConfig from './auto-import-config.json' with { type: 'json' }

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd())
  // const isMSWEnabled = mode !== 'production' && env.VITE_ENABLE_MSW === 'true'
  const baseUrl = env.VITE_API_URL || 'http://localhost:3000'
  const basePath = env.VITE_BASE_PATH || '/cofolio/'

  return defineConfig({
    define: {
      __BASE_URL__: JSON.stringify(baseUrl),
      __ENABLE_MSW__: JSON.stringify(env.VITE_ENABLE_MSW === 'true'),
      __BEARER_TOKEN__: JSON.stringify(env.VITE_AVENIR_ESR_ACCESS_TOKEN ? `Bearer ${env.VITE_AVENIR_ESR_ACCESS_TOKEN}` : 'Bearer token'),
      __USER_EPPN__: mode === 'development' && env.VITE_AVENIR_ESR_USER_EPPN ? JSON.stringify(env.VITE_AVENIR_ESR_USER_EPPN) : null,
      __AUTH_LOGIN_URL__: JSON.stringify(env.VITE_AUTH_LOGIN_URL || `${baseUrl}/auth/login`),
      __AUTH_LOGOUT_URL__: JSON.stringify(env.VITE_AUTH_LOGOUT_URL || `${baseUrl}/auth/logout`),
    },
    plugins: [
      vue({
        // On Windows, vitest cannot resolve absolute template assets (file:///assets/...), so skip their transformation
        template: process.env.VITEST && process.platform === 'win32' ? { transformAssetUrls: { includeAbsolute: false } } : undefined,
      }),
      vueJsx(),
      svgLoader(),
      VueDevTools(),
      AutoImport({
        include: [
          /\.[tj]sx?$/,
          /\.vue$/,
          /\.vue\?vue/,
        ],
        imports: [
          {
            vue: autoImportConfig.vue,
          },
          'vue-router',
          'pinia'
        ],
        vueTemplate: true,
        dts: './src/auto-imports.d.ts',
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),
      Components({
        extensions: ['vue'],
        dirs: ['src/components'], // Autoimport de vos composants qui sont dans le dossier `src/components`
        include: [/\.vue$/, /\.vue\?vue/],
        dts: './src/components.d.ts',
      }),
      // plugin disabled because currently we have same routes that are not yet implemented and mock is used in production
      // TODO: uncomment when each route has its orval generated file
      // !isMSWEnabled && {
      //   name: 'ignore-mocks-when-msw-disabled',
      //   enforce: 'pre',
      //   resolveId (source) {
      //     if (source.includes('__mocks__')) {
      //       return source
      //     }
      //     return null
      //   },
      //   load (id) {
      //     if (id.includes('__mocks__')) {
      //       return 'export default {}'
      //     }
      //     return null
      //   }
      // }
    ],
    base: basePath,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      dedupe: [
        'vue',
        'vue-router',
        '@vue/runtime-core',
        '@avenirs-esr/avenirs-dsav'
      ],
    },
    build: {
      rollupOptions: {
        onwarn (warning, warn) {
          if (warning.code === 'CIRCULAR_DEPENDENCY') {
            const isCofolioIssue = warning.ids?.some(id => !id.includes('node_modules'))

            if (isCofolioIssue) {
              const message = warning.message || JSON.stringify(warning)
              throw new Error(`❌ Circular dependency detected in your project:\n${message}`)
            }
          }
          warn(warning)
        },
      },
    },
  })
}
