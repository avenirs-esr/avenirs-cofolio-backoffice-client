import type { App } from 'vue'
import {
  createVueI18nPlugin,
  getBrowserLocale,
  i18n,
  parseLocaleModules,
  registerFeatureLocales
} from '@/plugins/vue-i18n/vue-i18n'
import { AvAvailableLocales } from '@/types/i18n.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect, vi } from 'vitest'

BddTest().given('a locale modules parser', () => {
  BddTest().when('default export is present', () => {
    BddTest().then('it should use default export', () => {
      const mockedModules = {
        '/locales/fr.json': { default: { hello: 'Bonjour' } },
        '/locales/en.json': { default: { hello: 'Hello' } }
      }

      const result = parseLocaleModules(mockedModules)
      expect(result.fr).toEqual({ hello: 'Bonjour' })
      expect(result.en).toEqual({ hello: 'Hello' })
    })
  })

  BddTest().when('there is no default export', () => {
    BddTest().then('it should use module itself', () => {
      const mockedModules = {
        '/locales/fr.json': { hello: 'Salut' },
        '/locales/en.json': { hello: 'Hi' }
      }

      const result = parseLocaleModules(mockedModules)
      expect(result.fr).toEqual({ hello: 'Salut' })
      expect(result.en).toEqual({ hello: 'Hi' })
    })
  })
})

BddTest().given('a browser locale getter', () => {
  const originalNavigator = navigator

  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', { value: originalNavigator, configurable: true })
  })

  BddTest().when('the browser locale is available', () => {
    BddTest().then('it should return the browser locale if it is available', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: { language: 'en-US' },
        configurable: true
      })
      expect(getBrowserLocale()).toBe('en')
    })
  })

  BddTest().when('the browser locale is not available', () => {
    BddTest().then('it should fallback to "fr" if the browser locale is not available', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: { language: 'ja-JP' },
        configurable: true
      })
      expect(getBrowserLocale()).toBe('fr')
    })
  })
})

BddTest().given('a feature locales register', () => {
  BddTest().when('registering', () => {
    BddTest().then('it should register feature locales without throwing', async () => {
      await expect(registerFeatureLocales('student')).resolves.not.toThrow()
    })
  })

  BddTest().when('a feature locale is missing', () => {
    BddTest().then('it should not throw when a non-existent feature is provided', async () => {
      await expect(registerFeatureLocales('non-existent-feature')).resolves.not.toThrow()
    })
  })
})

BddTest().given('a vue-i18n setup', () => {
  BddTest().when('initializing', () => {
    BddTest().then('it should initialize i18n with expected locales', () => {
      const messages = i18n.global.messages

      for (const lang of AvAvailableLocales) {
        expect(messages.value[lang]).toBeDefined()
      }
    })

    BddTest().then('it should set default locale to fr', () => {
      expect(i18n.global.locale.value).toBe('fr')
    })
  })
})

BddTest().given('a Vue i18n plugin creation method', () => {
  BddTest().when('calling the method', () => {
    BddTest().then('it should install i18n plugin', () => {
      const mockUse = vi.fn()
      const app = { use: mockUse } as unknown as App

      const plugin = createVueI18nPlugin()
      plugin.install(app)

      expect(mockUse).toHaveBeenCalledWith(i18n)
    })
  })
})
