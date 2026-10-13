import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { isRouteActive } from '@/utils/route/route'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

function buildRoute (overrides: Partial<RouteLocationNormalizedLoadedGeneric>): RouteLocationNormalizedLoadedGeneric {
  return {
    name: undefined,
    matched: [],
    ...overrides,
  } as unknown as RouteLocationNormalizedLoadedGeneric
}

const routeA = { name: 'route-a' }
const routeB = { name: 'route-b' }
const routeC = { name: 'route-c' }

BddTest().given('isRouteActive', () => {
  BddTest().when('the current route name directly matches one of the provided routes', () => {
    BddTest().then('it should return true', () => {
      const route = buildRoute({ name: 'route-a', matched: [] })
      expect(isRouteActive({ route, routes: [routeA, routeB] })).toBe(true)
    })
  })

  BddTest().when('the current route name does not match any of the provided routes', () => {
    BddTest().then('it should return false', () => {
      const route = buildRoute({ name: 'route-c', matched: [] })
      expect(isRouteActive({ route, routes: [routeA, routeB] })).toBe(false)
    })
  })

  BddTest().when('the current route name is not a string (Symbol)', () => {
    BddTest().then('it should skip the direct check and rely on matched routes', () => {
      const route = buildRoute({
        name: Symbol('route-a'),
        matched: [{ name: 'route-a' }] as any,
      })
      expect(isRouteActive({ route, routes: [routeA] })).toBe(true)
    })
  })

  BddTest().when('an ancestor matched route name matches one of the provided routes', () => {
    BddTest().then('it should return true', () => {
      const route = buildRoute({
        name: 'route-child',
        matched: [{ name: 'route-a' }, { name: 'route-child' }] as any,
      })
      expect(isRouteActive({ route, routes: [routeA] })).toBe(true)
    })
  })

  BddTest().when('no matched route name matches any of the provided routes', () => {
    BddTest().then('it should return false', () => {
      const route = buildRoute({
        name: 'route-child',
        matched: [{ name: 'route-parent' }, { name: 'route-child' }] as any,
      })
      expect(isRouteActive({ route, routes: [routeA, routeB] })).toBe(false)
    })
  })

  BddTest().when('a matched route name is not a string (Symbol)', () => {
    BddTest().then('it should skip it and not match', () => {
      const route = buildRoute({
        name: 'route-child',
        matched: [{ name: Symbol('route-a') }, { name: 'route-child' }] as any,
      })
      expect(isRouteActive({ route, routes: [routeA] })).toBe(false)
    })
  })

  BddTest().when('the routes list is empty', () => {
    BddTest().then('it should return false', () => {
      const route = buildRoute({ name: 'route-a', matched: [] })
      expect(isRouteActive({ route, routes: [] })).toBe(false)
    })
  })

  BddTest().when('the matched list is empty and route name does not match', () => {
    BddTest().then('it should return false', () => {
      const route = buildRoute({ name: 'route-c', matched: [] })
      expect(isRouteActive({ route, routes: [routeA, routeB] })).toBe(false)
    })
  })

  BddTest().when('multiple routes are provided and one matches via matched ancestors', () => {
    BddTest().then('it should return true for the matching one', () => {
      const route = buildRoute({
        name: 'route-leaf',
        matched: [{ name: 'route-b' }, { name: 'route-leaf' }] as any,
      })
      expect(isRouteActive({ route, routes: [routeA, routeB, routeC] })).toBe(true)
    })
  })
})
