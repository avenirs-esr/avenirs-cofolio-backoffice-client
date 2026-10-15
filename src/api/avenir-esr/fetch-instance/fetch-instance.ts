import type { BaseApiException } from '@/exceptions'
import { createCustomFetch, FetchInterceptorManager } from '@/api/fetch'
import { i18n } from '@/plugins/vue-i18n'
import { AvIsoLocaleMap } from '@/types'

const interceptorManager = new FetchInterceptorManager()

interceptorManager.addRequestInterceptor((url: string, options: RequestInit) => {
  // TODO: add any request-specific logic here (headers, params ...)
  const locale = i18n.global.locale.value
  const isoLocale = AvIsoLocaleMap[locale as keyof typeof AvIsoLocaleMap] ?? AvIsoLocaleMap.fr

  options.headers = {
    ...options.headers,
    'x-signed-context': 'student',
    'Accept-Language': isoLocale,
    'Authorization': __BEARER_TOKEN__,
    // header set only in development mode to be able to use local api, see @vite.config.ts
    ...(__USER_EPPN__ != null ? { eppn: __USER_EPPN__ } : {})
  }
  return options
})

interceptorManager.addResponseInterceptor(async (response: Response): Promise<Response> => {
  return response
})

const fetcher = createCustomFetch({
  baseUrl: `${__BASE_URL__}`,
  defaultHeaders: { 'Content-Type': 'application/json' },
}, interceptorManager)

export async function customFetch<T> (url: string, options: RequestInit): Promise<T> {
  return fetcher<T>(url, options)
}

export type ErrorType<_Error> = BaseApiException

export type BodyType<BodyData> = BodyData
