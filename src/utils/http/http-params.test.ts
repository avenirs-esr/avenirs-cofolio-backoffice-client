import type { SortValue } from '@/types'
import { ESortField, ESortOrder } from '@/api/avenir-esr'
import { formatSortValue, parseSortValue } from '@/utils/http/http-params'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect } from 'vitest'

BddTest().given('a sort value formatter and parser based on ESortField/ESortOrder', () => {
  BddTest().when('formatSortValue is called with NAME and ASC', () => {
    BddTest().then('it should return the combined sort value', () => {
      const result = formatSortValue(ESortField.NAME, ESortOrder.ASC)
      expect(result).toBe('NAME_ASC')
    })
  })

  BddTest().when('formatSortValue is called with DATE and DESC', () => {
    BddTest().then('it should return the combined sort value', () => {
      const result = formatSortValue(ESortField.DATE, ESortOrder.DESC)
      expect(result).toBe('DATE_DESC')
    })
  })

  BddTest().when('parseSortValue is called with a combined sort value', () => {
    BddTest().then('it should return the parsed sort criteria', () => {
      const result = parseSortValue('DATE_DESC' as SortValue)
      expect(result).toEqual({ sortField: ESortField.DATE, sortOrder: ESortOrder.DESC })
    })
  })
})
