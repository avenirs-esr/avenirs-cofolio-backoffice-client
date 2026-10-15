import { defineConfig } from 'orval'

export default defineConfig({
  'avenir-esr': {
    input: {
      target: './api-specs/avenir-esr.swagger.json',
    },
    output: {
      workspace: './src/api/avenir-esr/generated',
      target: './',
      client: 'vue-query',
      schemas: './types',
      mode: 'tags',
      clean: true,
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },
        mutator: {
          path: './../fetch-instance/fetch-instance.ts',
          name: 'customFetch',
        },
        enumGenerationType: 'enum',
        query: {
          useInfinite: false,
          usePrefetch: false,
          useInvalidate: true,
          useSetQueryData: false,
          useGetQueryData: false,
          signal: false,
          runtimeValidation: false,
        },
      },
    },
  }
})
