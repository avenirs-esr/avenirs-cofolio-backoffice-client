import type { Page } from '@playwright/test'

export async function waitMswToStart (page: Page) {
  await page.waitForLoadState('networkidle')
}
