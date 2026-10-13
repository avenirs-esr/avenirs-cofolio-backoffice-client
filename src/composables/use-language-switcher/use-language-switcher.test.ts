import { useLanguageSwitcher } from '@/composables/use-language-switcher/use-language-switcher'
import { getBrowserLocale, i18n } from '@/plugins/vue-i18n'
import { mountComposable } from '@/tests/utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a useLanguageSwitcher compsable', () => {
  let languageSwitcher: ReturnType<typeof useLanguageSwitcher>

  beforeEach(() => {
    const { result } = mountComposable(useLanguageSwitcher, { useI18n: true })
    languageSwitcher = result
  })

  BddTest().when('initializing', () => {
    BddTest().then('it should initialize with the current browser language', () => {
      expect(languageSwitcher.languageSelector.value.currentLanguage).toBe(getBrowserLocale())
    })
  })

  BddTest().when('selecting English', () => {
    BddTest().then('it should switch to English', () => {
      languageSwitcher.selectLanguage({ label: 'English', codeIso: 'en' })
      expect(languageSwitcher.languageSelector.value.currentLanguage).toBe('en')
    })
  })

  BddTest().when('switching language', () => {
    BddTest().then('it should update i18n', () => {
      languageSwitcher.selectLanguage({ label: 'English', codeIso: 'en' })
      expect(i18n.global.locale.value).toBe('en')
    })
  })
})
