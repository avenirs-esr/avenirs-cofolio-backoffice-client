import type { EAssociationContextType } from '@/api/avenir-esr'
import { type DefaultBodyType, HttpResponse, type StrictRequest } from 'msw'

export function isEmptyDataSetRequest (request: StrictRequest<DefaultBodyType>) {
  return request.headers.has('x-dataset-empty')
}

export function createEmptyPaginatedDatasetResponse<T extends DefaultBodyType> (): HttpResponse<T> | undefined {
  const body = { data: [], page: { pageSize: 4, totalElements: 0, totalPages: 0, page: 0 } }
  return HttpResponse.json(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  }) as unknown as HttpResponse<T>
}

/**
 * msw path parameters used by the association handlers, which answer for any
 * association context type since the API mutualized every association endpoint.
 */
export const anyAssociationContextType = ':contextType' as EAssociationContextType
export const anyAssociatedContextType = ':associatedContextType' as EAssociationContextType

export function getOptionalBooleanSearchParam (url: URL, name: string): boolean | undefined {
  const value = url.searchParams.get(name)

  return value === null ? undefined : value === 'true'
}
