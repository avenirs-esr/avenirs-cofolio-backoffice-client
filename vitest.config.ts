import { fileURLToPath, URL } from 'node:url'
import { configDefaults, coverageConfigDefaults, defineConfig, mergeConfig } from 'vitest/config'
// eslint-disable-next-line no-restricted-imports
import viteConfig from './vite.config'

export default ({ mode }: { mode: string }) => {
  const sharedExclusions = [
    'e2e/*',
    'a11y/*',
    '**/*types.ts',
    '**/*stub.ts',
    '**/*.stories.ts',
    'src/common/types/*',
    'src/bootstrap.ts',
    'src/main.ts',
    'src/features/**/index.ts',
    'src/api/**/generated/**',
    '**/*.d.ts',
    '**/*.fixtures.ts',
    '**/*.handlers.ts',
    'orval.config.ts',
    'src/App.vue',
    'public/mockServiceWorker.js',
    'src/__mocks__/*',
  ]

  // TODO: temporary exclusions due to use of @avenirs-esr/avenirs-dsav
  const tempExclusions = [
    'src/bootstrap.test.ts'
  ]

  const COVERAGE_THRESHOLD = 85

  return mergeConfig(
    viteConfig({ mode }),
    defineConfig({
      define: {
        __ENABLE_MSW__: true,
      },
      test: {
        globals: true,
        environment: 'jsdom',
        testTimeout: 10000,
        exclude: [...configDefaults.exclude, ...sharedExclusions, ...tempExclusions],
        root: fileURLToPath(new URL('./', import.meta.url)),
        setupFiles: [
          fileURLToPath(new URL('./vitest-setup.ts', import.meta.url)),
        ],
        coverage: {
          provider: 'v8',
          reporter: ['text', 'html'],
          include: ['src/**/*.{ts,vue}'],
          exclude: [...coverageConfigDefaults.exclude, ...sharedExclusions, ...tempExclusions],
          thresholds: {
            branches: COVERAGE_THRESHOLD,
            functions: COVERAGE_THRESHOLD,
            lines: COVERAGE_THRESHOLD,
            statements: COVERAGE_THRESHOLD,
          },
        },
      },
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
          'tests': fileURLToPath(new URL('./tests', import.meta.url)),
        },
        // in dev mode using npm link, @avenirs-dsav has also those packages in node_modules so we dedupe them
        dedupe: ['vue', 'vue-router', '@vue/runtime-core'],
      },
    }),
  )
}
