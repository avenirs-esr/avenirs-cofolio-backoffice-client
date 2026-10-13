import type { App } from 'vue'
import { AvAvailableLocales, type AvLocale } from '@/types/i18n.types'
import { createI18n } from 'vue-i18n'

export function parseLocaleModules (modules: Record<string, any>) {
  const result: Partial<Record<AvLocale, any>> = {}

  for (const [path, module] of Object.entries(modules)) {
    const langMatch = path.match(/\/([a-z]{2})\.json$/)
    const lang = langMatch?.[1] as AvLocale | undefined

    if (lang && AvAvailableLocales.includes(lang)) {
      result[lang] = (module as any).default ?? module
    }
  }

  return result
}

export function getBrowserLocale (): AvLocale {
  const browserLocale = navigator.language.split('-')?.[0] as AvLocale
  return AvAvailableLocales.includes(browserLocale) ? browserLocale : 'fr'
}

function getPersistedLocale (): AvLocale | undefined {
  try {
    const persistedStore = localStorage.getItem('studentUser')

    if (!persistedStore) {
      return
    }

    const parsedStore = JSON.parse(persistedStore)
    const currentLanguage = parsedStore?.languageSelector?.currentLanguage
    if (currentLanguage && AvAvailableLocales.includes(currentLanguage)) {
      return currentLanguage as AvLocale
    }
  }
  catch {}
}

const globalMessages = import.meta.glob<{ default: any }>('@/locales/*.json', { eager: true })
const messages = parseLocaleModules(globalMessages)

const locale = getPersistedLocale() ?? getBrowserLocale()
const fallbackLocale: AvLocale = 'en'

const i18n = createI18n({
  locale,
  fallbackLocale,
  messages,
  legacy: false,
})

/**
 * Dynamically register feature-based locales from global and all subfolders
 */
async function registerFeatureLocales (feature: string) {
  const localeModules = import.meta.glob<{ default: any }>('/src/features/**/**/locales/*.json', { eager: false })
  for (const [path, importFn] of Object.entries(localeModules)) {
    const featurePattern = new RegExp(`/src/features/${feature}/`)
    if (!featurePattern.test(path)) {
      continue
    }

    const langMatch = path.match(/\/locales\/([a-z]{2})\.json$/)
    const lang = langMatch?.[1] as AvLocale | undefined

    if (lang && AvAvailableLocales.includes(lang)) {
      try {
        const module = await importFn()
        i18n.global.mergeLocaleMessage(lang, module.default)
      }
      catch (error) {
        console.warn(`Failed to load locale from ${path}:`, error)
      }
    }
  }
}

async function initializeI18n () {
  await registerFeatureLocales('terms-of-service')
}

function createVueI18nPlugin () {
  return {
    install (app: App) {
      app.use(i18n)
    }
  }
}

export default createVueI18nPlugin()

export { createVueI18nPlugin, i18n, initializeI18n, registerFeatureLocales }
