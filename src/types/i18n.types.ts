export const AvAvailableLocales = ['en', 'fr'] as const satisfies readonly string[]
export type AvLocale = (typeof AvAvailableLocales)[number]

export const AvIsoLocaleMap: Record<AvLocale, string> = {
  en: 'en-US',
  fr: 'fr-FR',
}
