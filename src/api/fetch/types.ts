export interface FetchOptions extends RequestInit {
  skipUnauthorizedHandling?: boolean
}

export interface FetchConfig {
  baseUrl?: string
  defaultHeaders?: HeadersInit
}

export type RequestInterceptor = (url: string, options: RequestInit, config: FetchConfig) => RequestInit | Promise<RequestInit>

export interface ResponseInterceptorContext {
  url: string
  options: RequestInit
  config: FetchConfig
}

export type ResponseInterceptor = (response: Response, context: ResponseInterceptorContext) => Response | Promise<Response>
