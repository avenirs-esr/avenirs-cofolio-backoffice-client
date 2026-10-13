import type { ResponseInterceptorContext } from '@/api/fetch/types'
import { FetchInterceptorManager } from '@/api/fetch/fetch-interceptor-manager/fetch-interceptor-manager'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a fetch interceptor manager', () => {
  const dummyConfig = { baseUrl: 'https://avenir.esr.example.com', defaultHeaders: {} }
  let manager: FetchInterceptorManager

  beforeEach(() => {
    manager = new FetchInterceptorManager()
  })

  BddTest().when('receiving requests', () => {
    BddTest().then('it should apply request interceptors in order', async () => {
      manager = new FetchInterceptorManager()
      const interceptor1 = vi.fn((url, options) => ({ ...options, headers: { ...options.headers, 'x-api-key': 'x11yY' } }))
      const interceptor2 = vi.fn((url, options) => ({ ...options, headers: { ...options.headers, Authorization: 'Bearer Token' } }))
      manager.addRequestInterceptor(interceptor1)
      manager.addRequestInterceptor(interceptor2)

      const result = await manager.applyRequestInterceptors('/me/navigation-access', { headers: {} }, dummyConfig)
      expect(interceptor1).toHaveBeenCalled()
      expect(interceptor2).toHaveBeenCalled()
      expect(result.headers).toMatchObject({ 'x-api-key': 'x11yY', 'Authorization': 'Bearer Token' })
    })
  })

  BddTest().when('sending responses', () => {
    BddTest().then('it should apply response interceptors in order', async () => {
      const manager = new FetchInterceptorManager()
      const response = new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } })
      const context: ResponseInterceptorContext = {
        url: '/me/navigation-access',
        options: {},
        config: dummyConfig,
      }
      const interceptor1 = vi.fn(async (res: Response) => res)
      const interceptor2 = vi.fn(async (res: Response) => res)
      manager.addResponseInterceptor(interceptor1)
      manager.addResponseInterceptor(interceptor2)

      const result = await manager.applyResponseInterceptors(response, context)
      expect(interceptor1).toHaveBeenCalled()
      expect(interceptor2).toHaveBeenCalled()
      expect(result).toBe(response)
    })
  })
})
