import type { BaseApiException } from '@/exceptions'
import type { Ref } from 'vue'
import { useApiErrors } from '@/composables/use-api-errors/use-api-errors'
import { useToasterStore } from '@/store'

export function useBaseApiExceptionToast (errorRef: Ref<BaseApiException | BaseApiException> | Ref<null | null>) {
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()

  watch(errorRef, (error) => {
    if (error) {
      addErrorMessage(getErrorMessage(error))
    }
  }, { immediate: true })
}
