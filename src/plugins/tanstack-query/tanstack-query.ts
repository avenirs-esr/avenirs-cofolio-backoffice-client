import type { App } from 'vue'
import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'

function handleRetry (retryLimit: number) {
  return (failureCount: number): boolean => {
    return failureCount < retryLimit
  }
}

export default {
  install (app: App) {
    const queryOptions: VueQueryPluginOptions = {
      queryClientConfig: {
        defaultOptions: {
          queries: { retry: handleRetry(2) },
          mutations: { retry: handleRetry(1) },
        },
      },
    }

    app.use(VueQueryPlugin, queryOptions)
  },
}
