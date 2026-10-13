import type { FetchConfig, RequestInterceptor, ResponseInterceptor, ResponseInterceptorContext } from '@/api/fetch/types'

export class FetchInterceptorManager {
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []

  addRequestInterceptor (interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor)
  }

  addResponseInterceptor (interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor)
  }

  async applyRequestInterceptors (url: string, options: RequestInit, config: FetchConfig): Promise<RequestInit> {
    let finalOptions = { ...options }

    for (const interceptor of this.requestInterceptors) {
      finalOptions = await interceptor(url, finalOptions, config)
    }

    return finalOptions
  }

  async applyResponseInterceptors (response: Response, context: ResponseInterceptorContext): Promise<Response> {
    let finalResponse = response

    for (const interceptor of this.responseInterceptors) {
      finalResponse = await interceptor(finalResponse, context)
    }

    return finalResponse
  }
}
