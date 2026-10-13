import { EErrorCode as ApiErrors } from '@/api/avenir-esr/generated/types/eErrorCode'
import { BaseApiErrorCode } from '@/exceptions/base-api-error-codes'

export const ErrorCodes = {
  ...BaseApiErrorCode,
  ...ApiErrors
} as const

export type ErrorCode = BaseApiErrorCode | ApiErrors
