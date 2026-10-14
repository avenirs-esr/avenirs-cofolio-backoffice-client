import type { RouteLocationNormalized } from 'vue-router'
import { getPageTitle, scrollBehavior } from '@/router/router.utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { afterEach, expect, vi } from 'vitest'

BddTest().given('the router scroll behavior', () => {
  const to = {
    hash: '',
  } as RouteLocationNormalized

  const from = {} as RouteLocationNormalized

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().when('the target route has a hash', () => {
    BddTest().then('it should scroll smoothly to the target element', () => {
      const result = scrollBehavior(
        { ...to, hash: '#section' } as RouteLocationNormalized,
        from,
        null
      )

      expect(result).toEqual({
        el: '#section',
        behavior: 'smooth',
      })
    })
  })

  BddTest().when('a saved scroll position exists', () => {
    BddTest().then('it should restore the saved position', () => {
      const savedPosition = { left: 10, top: 120 }

      const result = scrollBehavior(
        to,
        from,
        savedPosition
      )

      expect(result).toBe(savedPosition)
    })
  })

  BddTest().when('scroll preservation is enabled', () => {
    BddTest().then('it should preserve the current position', () => {
      vi.spyOn(window.history, 'state', 'get').mockReturnValue({
        preserveScroll: true,
      })

      const result = scrollBehavior(to, from, null)

      expect(result).toBe(false)
    })
  })

  BddTest().when('no scroll condition applies', () => {
    BddTest().then('it should scroll to the top', () => {
      vi.spyOn(window.history, 'state', 'get').mockReturnValue({})

      const result = scrollBehavior(to, from, null)

      expect(result).toEqual({ top: 0 })
    })
  })
})

BddTest().given('a page title formatter', () => {
  BddTest().when('a specific title is provided', () => {
    BddTest().then('it should prefix the main title', () => {
      expect(getPageTitle('Administration')).toBe('Administration - CofolioBackOffice')
    })
  })

  BddTest().when('no specific title is provided', () => {
    BddTest().then('it should return the main title', () => {
      expect(getPageTitle()).toBe('CofolioBackOffice')
    })
  })
})
