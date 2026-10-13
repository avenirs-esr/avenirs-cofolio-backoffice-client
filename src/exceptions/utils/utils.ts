import type { BaseApiErrorBody } from '@/exceptions/types'
import { BaseApiErrorCode } from '@/exceptions/base-api-error-codes'
import { BaseApiException } from '@/exceptions/base-api-exception/base-api.exception'
import { hasStringField, HttpStatusCode } from '@/utils'

function isBaseApiErrorBody (errorData: unknown): errorData is BaseApiErrorBody {
  return hasStringField(errorData, 'message') && hasStringField(errorData, 'code')
}

function extractErrorCodeFromBaseApiErrorBody (
  status: number,
  errorData?: BaseApiErrorBody
): BaseApiErrorCode {
  if (status >= HttpStatusCode.INTERNAL_SERVER_ERROR) {
    return errorData?.code ?? BaseApiErrorCode.SERVER
  }
  if (status === HttpStatusCode.NOT_FOUND) {
    return errorData?.code ?? BaseApiErrorCode.NOT_FOUND
  }
  if (status === HttpStatusCode.FORBIDDEN) {
    return errorData?.code ?? BaseApiErrorCode.FORBIDDEN
  }
  if (status === HttpStatusCode.UNAUTHORIZED) {
    return errorData?.code ?? BaseApiErrorCode.UNAUTHORIZED
  }
  if (status >= HttpStatusCode.BAD_REQUEST) {
    return errorData?.code ?? BaseApiErrorCode.BAD_REQUEST
  }
  if (status === 0) {
    return BaseApiErrorCode.NETWORK
  }
  return errorData?.code ?? BaseApiErrorCode.UNKNOWN
}

export function createBasApiExceptionFromResponseBody (
  interceptedResponse: Response,
  errorData: BaseApiErrorBody | unknown,
  method = 'GET'
): BaseApiException {
  const isApiErrorBody = isBaseApiErrorBody(errorData)
  const status = isApiErrorBody ? errorData.status : interceptedResponse.status
  const details = isApiErrorBody ? errorData.details : undefined
  const message = hasStringField(errorData, 'message') ? errorData.message : `HTTP ${interceptedResponse.status}: ${interceptedResponse.statusText}`
  const code = isApiErrorBody ? extractErrorCodeFromBaseApiErrorBody(status, errorData) : extractErrorCodeFromBaseApiErrorBody(status)
  return new BaseApiException(
    message,
    status,
    code,
    method,
    details,
  )
}

export function createBaseApiExceptionFromUnknownError (error: unknown): BaseApiException {
  let message: string = 'Error during fetch'

  if (hasStringField(error, 'message')) {
    message = error.message
  }

  return new BaseApiException(
    message,
    0,
    BaseApiErrorCode.UNKNOWN
  )
}
