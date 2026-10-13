import type { BaseApiErrorBody } from '@/exceptions/types'
import { BaseApiErrorCode } from '@/exceptions/base-api-error-codes'
import { BaseApiException } from '@/exceptions/base-api-exception/base-api.exception'
import {
  createBasApiExceptionFromResponseBody,
  createBaseApiExceptionFromUnknownError
} from '@/exceptions/utils/utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

BddTest().given('exceptions utils', () => {
  BddTest().and('a createBasApiExceptionFromResponseBody function', () => {
    BddTest().when('receiving a valid BaseApiErrorBody', () => {
      BddTest().then('it should create an exception', () => {
        const response = { status: 403, statusText: 'Forbidden' } as Response
        const message = 'forbidden'
        const method = 'POST'
        const errorDetails = { reason: 'you don\'t have access' }
        const errorData: BaseApiErrorBody = {
          message,
          code: BaseApiErrorCode.FORBIDDEN,
          status: 403,
          details: errorDetails
        }
        const ex = createBasApiExceptionFromResponseBody(response, errorData, method)
        expect(ex).toBeInstanceOf(BaseApiException)
        expect(ex.status).toBe(403)
        expect(ex.code).toBe(BaseApiErrorCode.FORBIDDEN)
        expect(ex.message).toBe(message)
        expect(ex.method).toBe(method)
        expect(ex.details).toEqual(errorDetails)
      })
    })

    BddTest().when('receiving an unknown error data', () => {
      BddTest().then('it should create an exception', () => {
        const response = { status: 404, statusText: 'Not Found' } as Response
        const errorData = { message: 'student not found' }
        const ex = createBasApiExceptionFromResponseBody(response, errorData, 'GET')
        expect(ex).toBeInstanceOf(BaseApiException)
        expect(ex.status).toBe(404)
        expect(ex.code).toBe(BaseApiErrorCode.NOT_FOUND)
        expect(ex.message).toBe('student not found')
        expect(ex.method).toBe('GET')
        expect(ex.details).toBeUndefined()
      })
    })

    BddTest().when('receiving a status >= 500', () => {
      BddTest().then('it should return SERVER', () => {
        const res = { status: 500, statusText: 'Internal Server Error' } as Response
        expect(createBasApiExceptionFromResponseBody(res, {}, 'GET').code).toBe(BaseApiErrorCode.SERVER)
        expect(
          createBasApiExceptionFromResponseBody(res, { message: 'err', code: BaseApiErrorCode.FORBIDDEN, status: 500 }, 'GET').code
        ).toBe(BaseApiErrorCode.FORBIDDEN)
        expect(
          createBasApiExceptionFromResponseBody({ status: 502, statusText: 'Bad Gateway' } as Response, {}, 'GET').code
        ).toBe(BaseApiErrorCode.SERVER)
      })
    })

    BddTest().when('receiving a status 404', () => {
      BddTest().then('it should return NOT_FOUND', () => {
        const res = { status: 404, statusText: 'Not Found' } as Response
        expect(createBasApiExceptionFromResponseBody(res, {}, 'GET').code).toBe(BaseApiErrorCode.NOT_FOUND)
        expect(
          createBasApiExceptionFromResponseBody(res, { message: 'err', code: BaseApiErrorCode.SERVER, status: 404 }, 'GET').code
        ).toBe(BaseApiErrorCode.SERVER)
      })
    })

    BddTest().when('receiving a status 403', () => {
      BddTest().then('it should return FORBIDDEN', () => {
        const res = { status: 403, statusText: 'Forbidden' } as Response
        expect(createBasApiExceptionFromResponseBody(res, {}, 'GET').code).toBe(BaseApiErrorCode.FORBIDDEN)
        expect(
          createBasApiExceptionFromResponseBody(res, { message: 'err', code: BaseApiErrorCode.BAD_REQUEST, status: 403 }, 'GET').code
        ).toBe(BaseApiErrorCode.BAD_REQUEST)
      })
    })

    BddTest().when('receiving a status 401', () => {
      BddTest().then('it should return UNAUTHORIZED', () => {
        const res = { status: 401, statusText: 'Unauthorized' } as Response
        expect(createBasApiExceptionFromResponseBody(res, {}, 'GET').code).toBe(BaseApiErrorCode.UNAUTHORIZED)
        expect(
          createBasApiExceptionFromResponseBody(res, { message: 'err', code: BaseApiErrorCode.NOT_FOUND, status: 401 }, 'GET').code
        ).toBe(BaseApiErrorCode.NOT_FOUND)
      })
    })

    BddTest().when('receiving a status >= 400 (except 401, 403, 404)', () => {
      BddTest().then('it should return BAD_REQUEST', () => {
        const res = { status: 400, statusText: 'Bad Request' } as Response
        expect(createBasApiExceptionFromResponseBody(res, {}, 'GET').code).toBe(BaseApiErrorCode.BAD_REQUEST)
        expect(
          createBasApiExceptionFromResponseBody(res, { message: 'err', code: BaseApiErrorCode.SERVER, status: 400 }, 'GET').code
        ).toBe(BaseApiErrorCode.SERVER)
        expect(
          createBasApiExceptionFromResponseBody({ status: 402, statusText: 'Payment Required' } as Response, {}, 'GET').code
        ).toBe(BaseApiErrorCode.BAD_REQUEST)
      })
    })

    BddTest().when('receiving a status 0', () => {
      BddTest().then('it should return NETWORK', () => {
        const res = { status: 0, statusText: 'Network Error' } as Response
        expect(createBasApiExceptionFromResponseBody(res, {}, 'GET').code).toBe(BaseApiErrorCode.NETWORK)
      })
    })

    BddTest().when('receiving any other status', () => {
      BddTest().then('it should return UNKNOWN', () => {
        expect(
          createBasApiExceptionFromResponseBody({ status: 302, statusText: 'Found' } as Response, { message: 'err', code: BaseApiErrorCode.FORBIDDEN, status: 302 }, 'GET').code
        ).toBe(BaseApiErrorCode.FORBIDDEN)
        expect(
          createBasApiExceptionFromResponseBody({ status: 302, statusText: 'Found' } as Response, { message: 'err', status: 302 }, 'GET').code
        ).toBe(BaseApiErrorCode.UNKNOWN)
      })
    })
  })

  BddTest().and('a createBaseApiExceptionFromUnknownError function', () => {
    BddTest().when('receiving an Error instance', () => {
      BddTest().then('it should create an exception', () => {
        const message = 'Network error'
        const error = new Error(message)
        const ex = createBaseApiExceptionFromUnknownError(error)
        expect(ex).toBeInstanceOf(BaseApiException)
        expect(ex.status).toBe(0)
        expect(ex.code).toBe(BaseApiErrorCode.UNKNOWN)
        expect(ex.message).toBe(message)
      })
    })

    BddTest().when('receiving a non-Error', () => {
      BddTest().then('it should create an exception', () => {
        const message = 'cannot process request'
        const ex = createBaseApiExceptionFromUnknownError({ message })
        expect(ex).toBeInstanceOf(BaseApiException)
        expect(ex.status).toBe(0)
        expect(ex.code).toBe(BaseApiErrorCode.UNKNOWN)
        expect(ex.message).toBe(message)
      })
    })
  })
})
