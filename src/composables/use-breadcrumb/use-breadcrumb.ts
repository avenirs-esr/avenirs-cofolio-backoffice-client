import type { BreadcrumbLinkRaw } from '@/types/router.types'
import type { AvBreadcrumbProps } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

/**
 * Builds breadcrumb links from the current route's `meta.breadcrumb`, optionally appending
 * trailing entries whose content depends on data fetched by the view (e.g. an entity title).
 * The composable also automatically removes the `to` property from the last breadcrumb link,
 * ensuring it is not clickable.
 * @param trailingLinks A getter returning entries to append after the meta-based prefix.
 * @returns An object containing the computed `breadcrumbLinks` array.
 * @example
 * ```ts
 * const { breadcrumbLinks } = useBreadcrumb(() => [{ text: trace.value?.title ?? '' }])
 * ```
 */
export function useBreadcrumb (trailingLinks?: () => AvBreadcrumbProps['links']) {
  const route = useRoute()
  const { t } = useI18n()

  const metaBreadcrumbLinks = computed<AvBreadcrumbProps['links']>(() => {
    let breadcrumb = [] as BreadcrumbLinkRaw[]
    if (route.meta.breadcrumb) {
      breadcrumb = Array.isArray(route.meta.breadcrumb) ? route.meta.breadcrumb : [route.meta.breadcrumb]
    }
    return breadcrumb.map(link => ({
      text: t(link.textKey),
      to: typeof link.to === 'function' ? link.to(route) : link.to,
    }))
  })

  const breadcrumbLinks = computed<AvBreadcrumbProps['links']>(() => [
    ...metaBreadcrumbLinks.value,
    ...(trailingLinks?.() ?? []),
  ].map((link, index, array) => {
    if (index === array.length - 1 && link.to) {
      const { to, ...rest } = link
      return rest
    }
    return link
  }))

  return { breadcrumbLinks }
}
