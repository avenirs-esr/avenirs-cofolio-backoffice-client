import { BaseApiErrorCode } from '@/exceptions/base-api-error-codes'
import { BaseApiException } from '@/exceptions/base-api-exception/base-api.exception'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect } from 'vitest'

BddTest().given('a baseApiException', () => {
  BddTest().when('creating the new BaseApiException', () => {
    BddTest().then('it should construct with all properties', () => {
      const errorDetails = { name: 'name is required' }
      const err = new BaseApiException('msg', 404, BaseApiErrorCode.NOT_FOUND, 'GET', errorDetails)
      expect(err.message).toBe('msg')
      expect(err.status).toBe(404)
      expect(err.code).toBe(BaseApiErrorCode.NOT_FOUND)
      expect(err.method).toBe('GET')
      expect(err.details).toEqual(errorDetails)
      expect(err.name).toBe('BaseApiException')
    })

    BddTest().then('it should detect BaseApiException with isBaseApiError', () => {
      const ex = new BaseApiException('Unknown student id')
      expect(BaseApiException.isBaseApiError(ex)).toBe(true)
      expect(BaseApiException.isBaseApiError({})).toBe(false)
    })
  })
})
