import { createCustomFetch, FetchInterceptorManager } from '@/api/fetch'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { afterEach, beforeEach, expect, type MockedFunction, vi } from 'vitest'

const mockAddRequestInterceptor = vi.fn()
const mockAddResponseInterceptor = vi.fn()
const mockRemoveRequestInterceptor = vi.fn()
const mockRemoveResponseInterceptor = vi.fn()

function createFetchInterceptorManagerMock () {
  return {
    addRequestInterceptor: mockAddRequestInterceptor,
    addResponseInterceptor: mockAddResponseInterceptor,
    removeRequestInterceptor: mockRemoveRequestInterceptor,
    removeResponseInterceptor: mockRemoveResponseInterceptor,
  }
}

vi.mock('@/api/fetch', () => ({
  createCustomFetch: vi.fn(),
  FetchInterceptorManager: vi.fn(createFetchInterceptorManagerMock),
}))

BddTest().given('avenir-esr customFetch', () => {
  const mockFetcher = vi.fn()
  const mockFetch: MockedFunction<typeof fetch> = vi.fn()

  const mockedCreateCustomFetch = vi.mocked(createCustomFetch)
  const mockedFetchInterceptorManager = vi.mocked(FetchInterceptorManager)

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)

    mockedCreateCustomFetch.mockReturnValue(mockFetcher)

    mockFetch.mockResolvedValue(new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  BddTest().and('a fresh module import', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.resetModules()
    })

    BddTest().when('customFetch is called', () => {
      beforeEach(async () => {
        const { customFetch } = await import('./fetch-instance')
        await customFetch('/test', { method: 'GET' })
      })

      BddTest().then('should create FetchInterceptorManager instance', () => {
        expect(mockedFetchInterceptorManager).toHaveBeenCalledTimes(1)
        expect(mockAddRequestInterceptor).toHaveBeenCalledTimes(1)
        expect(mockAddResponseInterceptor).toHaveBeenCalledTimes(1)
      })

      BddTest().then('should call createCustomFetch with correct parameters', () => {
        expect(mockedCreateCustomFetch).toHaveBeenCalledWith({
          baseUrl: expect.any(String),
          defaultHeaders: { 'Content-Type': 'application/json' },
        }, expect.any(Object))
      })

      BddTest().then('should call the fetcher with correct parameters', () => {
        expect(mockFetcher).toHaveBeenCalledWith('/test', { method: 'GET' })
      })

      BddTest().then('should add x-signed-context header through interceptor', () => {
        const interceptorCall = mockAddRequestInterceptor.mock.calls[0]
        const interceptorFunction = interceptorCall[0]
        const testOptions: RequestInit = {
          method: 'POST',
        }
        const result = interceptorFunction('https://api.example.com/test', testOptions)
        expect(result).toEqual({
          method: 'POST',
          headers: {
            'Accept-Language': 'en-US',
            'Authorization': __BEARER_TOKEN__,
            'x-signed-context': 'student'
          }
        })
      })
    })
  })

  BddTest().and('a mock response is configured', () => {
    const mockResponse = { data: 'test response' }

    beforeEach(() => {
      mockFetcher.mockResolvedValueOnce(mockResponse)
      vi.clearAllMocks()
      vi.resetModules()
    })

    BddTest().when('customFetch is invoked', () => {
      let result: unknown

      beforeEach(async () => {
        const { customFetch } = await import('./fetch-instance')
        result = await customFetch('/test', { method: 'GET' })
      })

      BddTest().then('should return the mocked response', () => {
        expect(mockFetcher).toHaveBeenCalledWith('/test', { method: 'GET' })
        expect(result).toEqual(mockResponse)
      })
    })
  })

  BddTest().and('a User interface and mock user data', () => {
    interface User {
      id: number
      name: string
      email: string
    }

    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    }

    beforeEach(() => {
      mockFetcher.mockResolvedValueOnce(mockUser)
      vi.clearAllMocks()
      vi.resetModules()
    })

    BddTest().when('customFetch is called with generic type', () => {
      let result: User

      beforeEach(async () => {
        const { customFetch } = await import('./fetch-instance')
        result = await customFetch<User>('/api/users/1', { method: 'GET' })
      })

      BddTest().then('should pass through generic type correctly', () => {
        expect(result).toEqual(mockUser)
        expect(result.id).toBe(1)
        expect(result.name).toBe('John Doe')
        expect(result.email).toBe('john@example.com')
      })
    })
  })

  BddTest().and('complex request options', () => {
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {
        'Authorization': __BEARER_TOKEN__,
        'X-Custom-Header': 'custom-value'
      },
      body: JSON.stringify({ data: 'test' }),
      signal: new AbortController().signal
    }

    beforeEach(() => {
      mockFetcher.mockResolvedValueOnce({ success: true })
      vi.clearAllMocks()
      vi.resetModules()
    })

    BddTest().when('customFetch is called with complex options', () => {
      beforeEach(async () => {
        const { customFetch } = await import('./fetch-instance')
        await customFetch('/api/data', requestOptions)
      })

      BddTest().then('should preserve all request options when calling fetcher', () => {
        expect(mockFetcher).toHaveBeenCalledWith('/api/data', requestOptions)
      })
    })
  })

  BddTest().and('a module is imported', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      vi.resetModules()
      await import('./fetch-instance')
    })

    BddTest().when('module initialization occurs', () => {
      BddTest().then('should call createCustomFetch during initialization', () => {
        expect(mockedCreateCustomFetch).toHaveBeenCalledTimes(1)
        expect(mockedCreateCustomFetch).toHaveBeenCalledWith(
          {
            baseUrl: expect.any(String),
            defaultHeaders: { 'Content-Type': 'application/json' },
          },
          expect.any(Object)
        )
      })

      BddTest().then('should instantiate FetchInterceptorManager during initialization', () => {
        expect(mockedFetchInterceptorManager).toHaveBeenCalledTimes(1)
        expect(mockAddRequestInterceptor).toHaveBeenCalledTimes(1)
        expect(mockAddRequestInterceptor).toHaveBeenCalledWith(expect.any(Function))
      })
    })
  })
})
