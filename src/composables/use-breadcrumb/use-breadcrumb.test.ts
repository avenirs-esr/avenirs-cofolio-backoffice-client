import type { MetaBreadcrumb } from '@/types/router.types'
import { useBreadcrumb } from '@/composables/use-breadcrumb/use-breadcrumb'
import { mountComposable } from '@/tests/utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const route = ref<{
  meta: { breadcrumb?: MetaBreadcrumb }
  params: Record<string, string>
}>({ meta: {}, params: {} })

vi.mock('vue-router', () => ({
  useRoute: () => route.value,
}))

BddTest().given('a useBreadcrumb composable', () => {
  beforeEach(() => {
    route.value = { meta: {}, params: {} }
  })

  BddTest().when('the route has no breadcrumb meta', () => {
    BddTest().then('it should return an empty list', () => {
      const { result } = mountComposable(() => useBreadcrumb(), { useI18n: true })
      expect(result.breadcrumbLinks.value).toEqual([])
    })
  })

  BddTest().when('the route has a single breadcrumb meta', () => {
    beforeEach(() => {
      route.value = {
        meta: {
          breadcrumb: {
            textKey: 'global.detail',
            to: { name: 'student-detail' },
          },
        },
        params: {},
      }
    })

    BddTest().then('it should return the breadcrumb entry', () => {
      const { result } = mountComposable(() => useBreadcrumb(), { useI18n: true })
      expect(result.breadcrumbLinks.value).toEqual([
        { text: expect.any(String) },
      ])
    })
  })

  BddTest().when('the route has static breadcrumb meta', () => {
    beforeEach(() => {
      route.value = {
        meta: {
          breadcrumb: [
            { textKey: 'global.breadcrumb.ariaLabel', to: { name: 'student-home' } },
            { textKey: 'global.detail' },
          ]
        },
        params: {}
      }
    })

    BddTest().then('it should translate each entry and keep static "to"', () => {
      const { result } = mountComposable(() => useBreadcrumb(), { useI18n: true })
      expect(result.breadcrumbLinks.value).toEqual([
        { text: expect.any(String), to: { name: 'student-home' } },
        { text: expect.any(String), to: undefined },
      ])
    })
  })

  BddTest().when('a breadcrumb entry\'s "to" is a function', () => {
    beforeEach(() => {
      route.value = {
        meta: {
          breadcrumb: [
            {
              textKey: 'global.detail',
              to: currentRoute => ({
                name: 'student-trace',
                params: {
                  id: currentRoute.params.id as string,
                },
              }),
            },
            { textKey: 'global.breadcrumb.ariaLabel' }
          ],
        },
        params: {
          id: '42',
        },
      }
    })

    BddTest().then('it should resolve "to" with the current route', () => {
      const { result } = mountComposable(() => useBreadcrumb(), { useI18n: true })
      expect(result.breadcrumbLinks.value).toEqual([
        { text: expect.any(String), to: { name: 'student-trace', params: { id: '42' } } },
        { text: expect.any(String) }
      ])
    })
  })

  BddTest().when('two breadcrumb entries are provided with a defined to', () => {
    beforeEach(() => {
      route.value = {
        meta: {
          breadcrumb: [
            { textKey: 'global.breadcrumb.ariaLabel', to: { name: 'student-home' } },
            { textKey: 'global.detail', to: { name: 'student-detail' } },
          ]
        },
        params: {}
      }
    })

    BddTest().then('all breadcrumb entries except the last one should have a defined "to"', () => {
      const { result } = mountComposable(() => useBreadcrumb(), { useI18n: true })
      expect(result.breadcrumbLinks.value).toEqual([
        { text: expect.any(String), to: { name: 'student-home' } },
        { text: expect.any(String) },
      ])
    })
  })

  BddTest().when('trailing links are provided', () => {
    beforeEach(() => {
      route.value = {
        meta: {
          breadcrumb: [
            { textKey: 'global.breadcrumb.ariaLabel', to: { name: 'student-home' } },
          ]
        },
        params: {}
      }
    })

    BddTest().then('it should append them after the meta-based prefix', () => {
      const { result } = mountComposable(() => useBreadcrumb(() => [{ text: 'Dynamic title' }]), { useI18n: true })
      expect(result.breadcrumbLinks.value).toEqual([
        { text: expect.any(String), to: { name: 'student-home' } },
        { text: 'Dynamic title' },
      ])
    })
  })
})
