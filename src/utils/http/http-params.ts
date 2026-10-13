import type { ESortField, ESortOrder } from '@/api/avenir-esr'
import type { SortCriteria, SortValue } from '@/types'

export function formatSortValue (sortField: ESortField, sortOrder: ESortOrder): SortValue {
  return `${sortField}_${sortOrder}`
}

export function parseSortValue (value: SortValue): SortCriteria {
  const [sortField, sortOrder] = value.split('_') as [ESortField, ESortOrder]
  return { sortField, sortOrder }
}
