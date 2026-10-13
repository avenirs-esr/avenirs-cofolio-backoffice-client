import type { FetchConfig, ResponseInterceptorContext } from '@/api/fetch/types'
import { FetchInterceptorManager } from '@/api/fetch/fetch-interceptor-manager/fetch-interceptor-manager'
import {
  BaseApiException,
  createBasApiExceptionFromResponseBody,
  createBaseApiExceptionFromUnknownError,
} from '@/exceptions'

function buildUrl (url: string, baseUrl: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  const cleanPath = url.startsWith('/') ? url : `/${url}`

  return `${cleanBaseUrl}${cleanPath}`
}

async function getBody<T> (response: Response): Promise<T> {
  const contentType = (response.headers.get('content-type') || '').toLowerCase()
  const contentLength = response.headers.get('content-length')
  const contentDisposition = (response.headers.get('content-disposition') || '').toLowerCase()

  if (contentLength === '0' || response.status === 204) {
    return undefined as T
  }

  const isJsonResponse = contentType.includes('application/json') || contentType.includes('+json')
  const isTextResponse = contentType.startsWith('text/')
  const isBinaryResponse = contentDisposition.includes('attachment')
    || contentType.startsWith('image/')
    || contentType.startsWith('audio/')
    || contentType.startsWith('video/')
    || (contentType.startsWith('application/') && !isJsonResponse && !contentType.includes('xml'))

  if (isJsonResponse) {
    return await response.json() as T
  }

  if (isBinaryResponse) {
    return await response.blob() as T
  }

  if (isTextResponse) {
    return await response.text() as T
  }

  return await response.json() as T
}

function mergeHeaders (defaultHeaders: HeadersInit = {}, requestHeaders: HeadersInit = {}): HeadersInit {
  const headers = new Headers()

  const appendHeaders = (source: HeadersInit) => {
    if (source instanceof Headers) {
      for (const [key, value] of source.entries()) {
        headers.append(key, value)
      }
    }
    else if (Array.isArray(source)) {
      source.forEach(([key, value]) => {
        headers.set(key, value)
      })
    }
    else if (source && typeof source === 'object') {
      Object.entries(source).forEach(([key, value]) => {
        headers.set(key, value)
      })
    }
  }

  appendHeaders(defaultHeaders)
  appendHeaders(requestHeaders)

  return headers
}

function createCustomFetch (
  config: FetchConfig = {},
  interceptorManager: FetchInterceptorManager = new FetchInterceptorManager(),
) {
  const {
    baseUrl = __BASE_URL__,
    defaultHeaders = { 'Content-Type': 'application/json' },
  } = config

  return async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    try {
      const interceptedOptions = await interceptorManager.applyRequestInterceptors(url, options, config)

      const requestUrl = buildUrl(url, baseUrl)

      const shouldSkipDefaultContentType = interceptedOptions.body instanceof FormData
      const headersToMerge = shouldSkipDefaultContentType
        ? {}
        : defaultHeaders

      const mergedHeaders = mergeHeaders(headersToMerge, interceptedOptions.headers)

      const requestInit: RequestInit = {
        ...interceptedOptions,
        credentials: interceptedOptions.credentials ?? 'include',
        headers: mergedHeaders,
      }

      const response = await fetch(requestUrl, requestInit)

      const responseContext: ResponseInterceptorContext = {
        url: requestUrl,
        options: requestInit,
        config,
      }
      const interceptedResponse = await interceptorManager.applyResponseInterceptors(response, responseContext)

      if (!interceptedResponse.ok) {
        const errorData: unknown = await getBody(interceptedResponse.clone())
        throw createBasApiExceptionFromResponseBody(interceptedResponse, errorData, requestInit.method,)
      }

      return await getBody<T>(interceptedResponse)
    }
    catch (error: unknown) {
      if (error instanceof BaseApiException) {
        throw error
      }
      throw createBaseApiExceptionFromUnknownError(error)
    }
  }
}

export { createCustomFetch }
