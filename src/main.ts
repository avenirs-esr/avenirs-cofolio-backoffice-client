import { createVueApp } from '@/bootstrap'

async function enableMsw () {
  const basePath = import.meta.env.VITE_BASE_PATH || '/cofolio/'

  if (import.meta.env.MODE === 'production' || !__ENABLE_MSW__) {
    return
  }

  const { worker } = await import('@/__mocks__/msw/browser')

  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${basePath}mockServiceWorker.js`
    }
  })
}

enableMsw().then(async () => {
  const app = await createVueApp()
  app.mount('#app')
})
