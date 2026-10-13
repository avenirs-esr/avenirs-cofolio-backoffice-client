import { createCustomFetch } from '@/api/fetch/fetch-factory/fetch-factory'
import { FetchInterceptorManager } from '@/api/fetch/fetch-interceptor-manager/fetch-interceptor-manager'
import { BaseApiErrorCode, BaseApiException } from '@/exceptions'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect, type MockedFunction, vi } from 'vitest'

BddTest().given('a custom fetch creator', () => {
  const baseUrl = 'https://avenir.esr.example.com'
  const defaultHeaders = { 'Content-Type': 'application/json', 'X-Default': '1' }
  let interceptorManager: FetchInterceptorManager
  const mockFetch: MockedFunction<typeof fetch> = vi.fn()

  beforeEach(() => {
    interceptorManager = new FetchInterceptorManager()
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().when('creating a custom fetch with baseUrl', () => {
    BddTest().then('it should build the correct URL', async () => {
      const headers = new Headers()
      headers.set('Content-Type', 'application/json')
      vi.mocked(mockFetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), { status: 200, headers })
      )
      const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
      await fetcher('/me/navigation-access', { headers })
      expect(mockFetch).toHaveBeenCalledWith('https://avenir.esr.example.com/me/navigation-access', expect.any(Object))
    })
  })

  BddTest().when('creating a custom fetch without baseUrl', () => {
    BddTest().then('it should build the URL', async () => {
      vi.mocked(mockFetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': '' } })
      )
      const fetcher = createCustomFetch({ baseUrl, defaultHeaders }, interceptorManager)
      await fetcher('https://avenir.esr.example.com/me/navigation-access', {})
      expect(mockFetch).toHaveBeenCalledWith('https://avenir.esr.example.com/me/navigation-access', expect.any(Object))
    })
  })

  BddTest().when('creating a custom fetch with default and request headers', () => {
    BddTest().then('it should merge default and request headers', async () => {
      vi.mocked(mockFetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
      )
      const fetcher = createCustomFetch({ baseUrl, defaultHeaders }, interceptorManager)
      await fetcher('me/navigation-access', { headers: [['content-type', 'application/json'], ['X-Country', 'fr']] })
      const expectedHeaders = new Headers()
      expectedHeaders.set('Content-Type', 'application/json')
      expectedHeaders.set('X-Default', '1')
      expectedHeaders.set('X-Country', 'fr')
      expect(mockFetch).toHaveBeenCalledWith('https://avenir.esr.example.com/me/navigation-access', { credentials: 'include', headers: expectedHeaders })
    })
  })

  BddTest().when('creating a custom fetch for application/json', () => {
    BddTest().then('it should return JSON body', async () => {
      const responseBody = {
        APC: {
          enabledByInstitution: true,
          hasProgram: false
        },
        LIFE_PROJECT: {
          enabledByInstitution: true
        }
      }
      vi.mocked(mockFetch).mockResolvedValueOnce(
        new Response(JSON.stringify(responseBody), { status: 200, headers: { 'content-type': 'application/json' } })
      )
      const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
      const result = await fetcher<typeof responseBody>('/me/navigation-access')
      expect(result).toEqual(responseBody)
    })
  })

  BddTest().when('creating a custom fetch for application/pdf', () => {
    BddTest().then('it should return body', async () => {
      const pdfContent = 'PDF content'
      vi.mocked(mockFetch).mockResolvedValueOnce(
        new Response(pdfContent, { status: 200, headers: { 'content-type': 'application/pdf' } })
      )
      const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
      const result = await fetcher<Blob>('/me/resumes')
      const responseText = await result.text()
      expect(responseText).toBe(pdfContent)
    })
  })

  BddTest().when('creating a custom fetch for image content', () => {
    BddTest().then('it should return a blob', async () => {
      const imageContent = 'PNG content'
      vi.mocked(mockFetch).mockResolvedValueOnce(
        new Response(imageContent, { status: 200, headers: { 'content-type': 'image/png' } })
      )
      const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
      const result = await fetcher<Blob>('/me/traces/attachment')
      const responseText = await result.text()
      expect(responseText).toBe(imageContent)
    })
  })

  BddTest().when('creating a custom fetch for application/octet-stream', () => {
    BddTest().then('it should return body', async () => {
      const content = 'Binary content'
      vi.mocked(mockFetch).mockResolvedValueOnce(
        new Response(content, { status: 200, headers: { 'content-type': 'application/octet-stream' } })
      )
      const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
      const result = await fetcher<Blob>('/me/resumes')
      const responseText = await result.text()
      expect(responseText).toBe(content)
    })
  })

  BddTest().when('creating a custom fetch for text/plain', () => {
    BddTest().then('it should return body', async () => {
      const content = 'text content'
      vi.mocked(mockFetch).mockResolvedValueOnce(
        new Response(content, { status: 200, headers: { 'content-type': 'text/plain' } })
      )
      const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
      const result = await fetcher<string>('/me/resumes')
      expect(result).toBe(content)
    })
  })

  BddTest().when('creating a custom fetch and receiving a non-ok response', () => {
    BddTest().then('it should throw fetch error', async () => {
      vi.mocked(mockFetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'fail', message: 'Invalid email' }), { status: 400, statusText: 'Bad Request', headers: { 'content-type': 'application/json' } })
      )
      const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
      try {
        await fetcher('/fail')
      }
      catch (err: any) {
        expect(err).toBeInstanceOf(BaseApiException)
        expect(err).toMatchObject({
          status: 400,
          code: BaseApiErrorCode.BAD_REQUEST,
          method: 'GET',
          name: 'BaseApiException'
        })
        expect(err.message).toBe('Invalid email')
      }
    })
  })

  BddTest().when('creating a custom fetch and passing an interceptor manager', () => {
    BddTest().then('it should apply request and response interceptors', async () => {
      const reqSpy = vi.fn((url, options) => ({ ...options, headers: { ...options.headers, 'X-Test': 'yes' } }))
      const resSpy = vi.fn(async (response, _context) => response)
      interceptorManager.addRequestInterceptor(reqSpy)
      interceptorManager.addResponseInterceptor(resSpy)
      vi.mocked(mockFetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
      )
      const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
      await fetcher('/test', {})
      expect(reqSpy).toHaveBeenCalled()
      expect(resSpy).toHaveBeenCalled()
    })
  })

  BddTest().when('creating a custom fetch and passing an interceptor manager', () => {
    BddTest().then('it should apply request and response interceptors', async () => {
      const reqSpy = vi.fn((url, options) => ({ ...options, headers: { ...options.headers, 'X-Test': 'yes' } }))
      const resSpy = vi.fn(async (response, _context) => response)
      interceptorManager.addRequestInterceptor(reqSpy)
      interceptorManager.addResponseInterceptor(resSpy)
      vi.mocked(mockFetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
      )
      const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
      await fetcher('/test', {})
      expect(reqSpy).toHaveBeenCalled()
      expect(resSpy).toHaveBeenCalled()
    })

    BddTest().then('it should catch thrown error while applying interceptors', async () => {
      const message = 'Interceptor error'
      const reqSpy = vi.fn(() => {
        throw new Error('Interceptor error')
      })
      interceptorManager.addRequestInterceptor(reqSpy)

      const fetcher = createCustomFetch({ baseUrl }, interceptorManager)
      await expect(fetcher('/test', {})).rejects.toThrow(message)
    })
  })
})
