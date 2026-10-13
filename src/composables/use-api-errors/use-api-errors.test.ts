import type { Ref } from 'vue'
import { useApiErrors } from '@/composables/use-api-errors/use-api-errors'
import { BaseApiErrorCode, type BaseApiException } from '@/exceptions'
import { mountComposable } from '@/tests/utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a useApiErrors composable', () => {
  let errorRef: Ref<BaseApiException | null>
  let result: ReturnType<typeof useApiErrors>

  beforeEach(() => {
    errorRef = ref(null)
    const { result: res } = mountComposable(() => useApiErrors(errorRef), { usePinia: false, useI18n: true })
    result = res
  })

  BddTest().when('error is null', () => {
    BddTest().then('isNotFound should return false', () => {
      expect(result.isNotFound.value).toBe(false)
    })

    BddTest().then('originalErrorCode should be undefined', () => {
      expect(result.originalErrorCode.value).toBeUndefined()
    })

    BddTest().then('isMatchingErrorCode should return false for any code', () => {
      expect(result.isMatchingErrorCode(BaseApiErrorCode.NOT_FOUND)).toBe(false)
    })
  })

  BddTest().when('error code is NOT_FOUND', () => {
    beforeEach(() => {
      errorRef.value = {
        message: 'Not Found',
        name: 'Error',
        status: 400,
        code: BaseApiErrorCode.NOT_FOUND,
      }
    })

    BddTest().then('isNotFound should return true', () => {
      expect(result.isNotFound.value).toBe(true)
    })

    BddTest().then('originalErrorCode should return NOT_FOUND', () => {
      expect(result.originalErrorCode.value).toBe(BaseApiErrorCode.NOT_FOUND)
    })

    BddTest().then('isMatchingErrorCode should return true for NOT_FOUND', () => {
      expect(result.isMatchingErrorCode(BaseApiErrorCode.NOT_FOUND)).toBe(true)
    })

    BddTest().then('isMatchingErrorCode should return false for other codes', () => {
      expect(result.isMatchingErrorCode(BaseApiErrorCode.FORBIDDEN)).toBe(false)
    })
  })

  BddTest().when('error code is not NOT_FOUND', () => {
    beforeEach(() => {
      errorRef.value = {
        message: 'Forbidden',
        name: 'Error',
        status: 403,
        code: BaseApiErrorCode.FORBIDDEN,
      }
    })

    BddTest().then('isNotFound should return false', () => {
      expect(result.isNotFound.value).toBe(false)
    })

    BddTest().then('originalErrorCode should return FORBIDDEN', () => {
      expect(result.originalErrorCode.value).toBe(BaseApiErrorCode.FORBIDDEN)
    })

    BddTest().then('isMatchingErrorCode should return true for FORBIDDEN', () => {
      expect(result.isMatchingErrorCode(BaseApiErrorCode.FORBIDDEN)).toBe(true)
    })
  })

  BddTest().when('the errorRef value changes over time', () => {
    BddTest().then('isNotFound should reactively update', async () => {
      expect(result.isNotFound.value).toBe(false)

      errorRef.value = {
        message: 'Not Found',
        name: 'Error',
        status: 400,
        code: BaseApiErrorCode.NOT_FOUND,
      }
      await Promise.resolve()
      expect(result.isNotFound.value).toBe(true)

      errorRef.value = null
      await Promise.resolve()
      expect(result.isNotFound.value).toBe(false)
    })

    BddTest().then('originalErrorCode should reactively update', async () => {
      expect(result.originalErrorCode.value).toBeUndefined()

      errorRef.value = {
        message: 'Forbidden',
        name: 'Error',
        status: 403,
        code: BaseApiErrorCode.FORBIDDEN,
      }
      await Promise.resolve()
      expect(result.originalErrorCode.value).toBe(BaseApiErrorCode.FORBIDDEN)

      errorRef.value = null
      await Promise.resolve()
      expect(result.originalErrorCode.value).toBeUndefined()
    })
  })

  BddTest().when('getting an API error message', () => {
    BddTest().then('it should return the mapped i18n value when key exists', () => {
      const message = result.getErrorMessage({
        message: 'User not found',
        name: 'Error',
        status: 400,
        code: 'USER_NOT_FOUND' as BaseApiErrorCode,
      })

      expect(message).toBe('Utilisateur introuvable')
    })

    BddTest().then('it should return the generic message when key does not exist', () => {
      const message = result.getErrorMessage({
        message: 'Unknown',
        name: 'Error',
        status: 500,
        code: 'SOME_UNKNOWN_ERROR_CODE' as BaseApiErrorCode,
      })

      expect(message).toBe('Une erreur est survenue. Veuillez réessayer ultérieurement.')
    })

    BddTest().then('it should return the generic message when error is null', () => {
      const message = result.getErrorMessage(null)

      expect(message).toBe('Une erreur est survenue. Veuillez réessayer ultérieurement.')
    })
  })
})
