import type { BaseApiException } from '@/exceptions'

export interface MutationArgs<TData = unknown, TVariables = unknown, TError = BaseApiException> {
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>
  onError?: (error: TError) => void | Promise<void>
}
