import { ROUTES } from '@/constants'
import router from '@/router'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

BddTest().given('the application router', () => {
  beforeEach(() => {
    document.title = ''

    vi.stubGlobal('scrollTo', vi.fn())
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  BddTest().when('navigating to the home route', () => {
    beforeEach(async () => {
      await router.push(ROUTES.HOME.path)
      await router.isReady()
    })

    BddTest().then('it should resolve the home route', async () => {
      expect(router.currentRoute.value.matched.length).toBeGreaterThan(0)
    })

    BddTest().then('it should render an empty component on the home route', async () => {
      const homeRoute = router.getRoutes().find(
        route => route.name === ROUTES.HOME.name
      )

      const component = homeRoute?.components?.default

      expect(component).toBeDefined()
      expect(component).toHaveProperty('render')

      if (component && typeof component === 'object' && 'render' in component) {
        expect(component.render!()).toBeNull()
      }
    })
  })

  BddTest().when('navigating to an unknown route', () => {
    BddTest().then('it should resolve the NotFound route', async () => {
      await router.push('/this-route-does-not-exist')
      await flushPromises()

      expect(router.currentRoute.value.name).toBe('NotFound')
    })
  })

  BddTest().when('navigating to a route with a title', () => {
    BddTest().then('it should update the document title', async () => {
      const testRouter = createRouter({
        history: createMemoryHistory(),
        routes: [
          {
            path: '/test',
            name: 'test',
            component: { render: () => null },
            meta: { title: 'Test page' },
          },
        ],
      })

      testRouter.beforeEach(async (to) => {
        const specificTitle = to.meta.title ? `${to.meta.title} - ` : ''
        document.title = `${specificTitle}Cofolio`
      })

      await testRouter.push('/test')
      await testRouter.isReady()

      expect(document.title).toBe('Test page - Cofolio')
    })
  })

  BddTest().when('navigating to a route without a title', () => {
    BddTest().then('it should use the main title', async () => {
      const testRouter = createRouter({
        history: createMemoryHistory(),
        routes: [
          {
            path: '/test',
            name: 'test',
            component: { render: () => null },
          },
        ],
      })

      testRouter.beforeEach(async (to) => {
        const specificTitle = to.meta.title ? `${to.meta.title} - ` : ''
        document.title = `${specificTitle}Cofolio`
      })

      await testRouter.push('/test')
      await testRouter.isReady()

      expect(document.title).toBe('Cofolio')
    })
  })
})
