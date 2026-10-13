import type { BaseApiException } from '@/exceptions'
import type { Ref } from 'vue'
import { type ErrorCode, ErrorCodes } from '@/constants'
import { useI18n } from 'vue-i18n'

export function useApiErrors (errorRef?: Ref<BaseApiException> | Ref<null>) {
  const { t, te } = useI18n()

  const isNotFound = computed(() => {
    const error = errorRef?.value
    if (!error) {
      return false
    }
    return error.code === ErrorCodes.NOT_FOUND || errorRef.value.status === 404
  })

  const originalErrorCode = computed(() => errorRef?.value?.code)

  function isMatchingErrorCode (code: ErrorCode) {
    const error = errorRef?.value
    if (!error) {
      return false
    }
    return error.code === code
  }

  function getErrorMessage (error: BaseApiException | null) {
    const i18nKey = `global.error.api.${error?.code}`
    return te(i18nKey) ? t(i18nKey) : t('global.error.generic')
  }

  return {
    originalErrorCode,
    isNotFound,
    isMatchingErrorCode,
    getErrorMessage,
  }
}
