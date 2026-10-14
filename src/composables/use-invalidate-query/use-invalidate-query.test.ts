import { useInvalidateAllQueriesAfterLocaleChange, useInvalidateQuery } from '@/composables/use-invalidate-query/use-invalidate-query'
import { mountComposable } from '@/tests/utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { type QueryClient, useQueryClient } from '@tanstack/vue-query'
import { expect, type Mock, vi } from 'vitest'

BddTest().given('an useInvalidateQuery composable', () => {
  let mockInvalidateQueries: Mock<QueryClient['invalidateQueries']>

  beforeEach(() => {
    mockInvalidateQueries = vi.fn<QueryClient['invalidateQueries']>().mockResolvedValue(undefined)
  })

  BddTest().and('a queryKey is defined', () => {
    const queryKey = ['my', 'query', 'key']

    BddTest().when('the invalidate function is called', () => {
      BddTest().then('it should call queryClient.invalidateQueries with the queryKey', async () => {
        const { result } = mountComposable(() => {
          const queryClient = useQueryClient()
          vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(mockInvalidateQueries)
          return useInvalidateQuery(queryKey)
        }, {
          useTanstack: true,
          queryClientConfig: {
            defaultOptions: {
              queries: { retry: false },
              mutations: { retry: false }
            }
          }
        })

        await result()

        expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey })
      })

      BddTest().then('it should silently handle query invalidation errors', async () => {
        const mockInvalidateQueries = vi.fn<QueryClient['invalidateQueries']>()
          .mockRejectedValue(new Error('Invalidation failed'))

        const { i18n } = await import('@/plugins/vue-i18n')
        const previousLocale = i18n.global.locale.value

        try {
          mountComposable(() => {
            const queryClient = useQueryClient()
            vi.spyOn(queryClient, 'invalidateQueries')
              .mockImplementation(mockInvalidateQueries)

            useInvalidateAllQueriesAfterLocaleChange()
          }, {
            useTanstack: true,
            queryClientConfig: {
              defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false }
              }
            }
          })

          i18n.global.locale.value = previousLocale === 'fr' ? 'en' : 'fr'

          await vi.waitFor(() => {
            expect(mockInvalidateQueries).toHaveBeenCalled()
          })

          // The rejection must be swallowed by catch(() => {}).
          await expect(
            mockInvalidateQueries.mock.results[0].value
          ).rejects.toThrow('Invalidation failed')
        }
        finally {
          i18n.global.locale.value = previousLocale
        }
      })
    })
  })

  BddTest().and('no queryKey', () => {
    BddTest().when('the invalidate function is called', () => {
      BddTest().then('it should call queryClient.invalidateQueries without queryKey', async () => {
        const { result } = mountComposable(() => {
          const queryClient = useQueryClient()
          vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(mockInvalidateQueries)
          return useInvalidateQuery()
        }, {
          useTanstack: true,
          queryClientConfig: {
            defaultOptions: {
              queries: { retry: false },
              mutations: { retry: false }
            }
          }
        })

        await result()

        expect(mockInvalidateQueries).toHaveBeenCalledWith()
      })
    })
    BddTest().when('the invalidate function is called with override key', () => {
      BddTest().then('it should call queryClient.invalidateQueries without override queryKey', async () => {
        const { result } = mountComposable(() => {
          const queryClient = useQueryClient()
          vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(mockInvalidateQueries)
          return useInvalidateQuery()
        }, {
          useTanstack: true,
          queryClientConfig: {
            defaultOptions: {
              queries: { retry: false },
              mutations: { retry: false }
            }
          }
        })

        await result(['custom-key'])

        expect(mockInvalidateQueries).toHaveBeenCalledWith({
          queryKey: ['custom-key']
        })
      })
    })
  })
})

BddTest().given('an useInvalidateAllQueriesAfterLocaleChange composable', () => {
  BddTest().when('locale changes occurs', () => {
    BddTest().then('it should invalidate all queries', async () => {
      const mockInvalidateQueries = vi.fn<QueryClient['invalidateQueries']>().mockResolvedValue(undefined)
      mountComposable(() => {
        const queryClient = useQueryClient()
        vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(mockInvalidateQueries)
        useInvalidateAllQueriesAfterLocaleChange()
      }, {
        useTanstack: true,
        queryClientConfig: {
          defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
          }
        }
      })

      const { i18n } = await import('@/plugins/vue-i18n')
      i18n.global.locale.value = 'en'

      await vi.waitFor(() => {
        expect(mockInvalidateQueries).toHaveBeenCalled()
      })
    })
  })
})
