import type { BaseApiException } from '@/exceptions'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'

export function createMockQueryError<T> (
  payload: T,
  error: BaseApiException,
): UseQueryDefinedReturnType<T, BaseApiException> {
  const data = ref(payload)
  const errorRef = ref(error)

  return {
    data,
    error: errorRef,
    isError: true,
    isLoading: false,
    isSuccess: false,
  } as unknown as UseQueryDefinedReturnType<T, BaseApiException>
}
