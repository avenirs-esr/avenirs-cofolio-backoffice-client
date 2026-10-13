import type { ErrorDetails } from '@/exceptions/types'
import { type ErrorCode, ErrorCodes } from '@/constants'

export class BaseApiException extends Error {
  public readonly status: number
  public readonly code: ErrorCode
  public readonly method?: string
  public readonly details?: ErrorDetails

  constructor (
    message: string,
    status: number = 500,
    code: ErrorCode = ErrorCodes.UNKNOWN,
    method?: string,
    details?: ErrorDetails,
  ) {
    super(message)
    Object.setPrototypeOf(this, BaseApiException.prototype)
    this.name = 'BaseApiException'
    this.status = status
    this.code = code
    this.details = details
    this.method = method
  }

  static isBaseApiError (error: unknown): error is BaseApiException {
    return error instanceof BaseApiException
  }
}
