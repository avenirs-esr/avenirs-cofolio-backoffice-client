import type { ESortField, ESortOrder } from '@/api/avenir-esr'

export type SortValue = `${ESortField}_${ESortOrder}`

export interface SortCriteria {
  sortField: ESortField
  sortOrder: ESortOrder
}
