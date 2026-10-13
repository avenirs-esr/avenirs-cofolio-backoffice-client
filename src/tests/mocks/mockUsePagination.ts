import type { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { vi } from 'vitest'

export function createUsePaginationMock () {
  const currentPage = ref(0)
  const pageSizeSelected = ref(10)

  const onUpdateCurrentPage = vi.fn((page: number) => {
    currentPage.value = page
  })

  const onUpdatePageSize = vi.fn((size: PageSizes) => {
    pageSizeSelected.value = size
    currentPage.value = 0
  })

  const resetCurrentPage = vi.fn(() => {
    currentPage.value = 0
  })

  return {
    currentPage,
    pageSizeSelected,
    onUpdateCurrentPage,
    onUpdatePageSize,
    resetCurrentPage
  }
}
