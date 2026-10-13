import { BaseApiException } from '@/exceptions'
import TanstackQueryPlugin from '@/plugins/tanstack-query/tanstack-query'
import { HttpStatusCode } from '@/utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { expect, vi } from 'vitest'

const useMock = vi.fn()
const appMock = { use: useMock }

TanstackQueryPlugin.install(appMock as any)
const [plugin, { queryClientConfig }] = useMock.mock.calls[0]
const queriesRetry = queryClientConfig.defaultOptions.queries.retry
const mutationsRetry = queryClientConfig.defaultOptions.mutations.retry

const error500 = new BaseApiException('Server Error', HttpStatusCode.INTERNAL_SERVER_ERROR)

BddTest().given('a tanstack query plugin', () => {
  BddTest().when('installing the plugin', () => {
    BddTest().then('it should install VueQueryPlugin', () => {
      expect(plugin).toBe(VueQueryPlugin)
    })
  })

  BddTest().when('a query fails', () => {
    BddTest().then('it should retry up to 2 times', () => {
      expect(queriesRetry(0, error500)).toBe(true)
      expect(queriesRetry(1, error500)).toBe(true)
      expect(queriesRetry(2, error500)).toBe(false)
    })
  })

  BddTest().when('a mutation fails', () => {
    BddTest().then('it should retry up to 1 time', () => {
      expect(mutationsRetry(0, error500)).toBe(true)
      expect(mutationsRetry(1, error500)).toBe(false)
    })
  })
})
