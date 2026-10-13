import type { AvLocale } from '@/types'
import type { AvLanguageSelectorElement } from '@avenirs-esr/avenirs-dsav'
import { getBrowserLocale } from '@/plugins/vue-i18n'
import { useI18n } from 'vue-i18n'

export function useLanguageSwitcher () {
  const { t, locale } = useI18n()

  const languageSelectorLabel = computed(() => t('global.header.languageSwitcher'))

  const languageSelector = ref({
    languages: [
      { label: 'Français', codeIso: 'fr' },
      { label: 'English', codeIso: 'en' },
    ],
    currentLanguage: getBrowserLocale(),
    title: languageSelectorLabel.value
  })

  watch(languageSelectorLabel, (label) => {
    languageSelector.value.title = label
  }, { immediate: true })

  function selectLanguage (language: AvLanguageSelectorElement) {
    languageSelector.value.currentLanguage = language.codeIso as AvLocale
    locale.value = language.codeIso
  }

  return {
    languageSelector,
    selectLanguage,
  }
}
