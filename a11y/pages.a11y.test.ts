import fs from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROUTES } from '@/constants'
import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { GLOBAL_TIMEOUT } from 'a11y/playwright.a11y.config'
import { waitMswToStart } from 'a11y/utils'
import { createHtmlReport } from 'axe-html-reporter'

const __dirname = dirname(fileURLToPath(import.meta.url))

const routesToCheck = [
  ROUTES.TERMS_OF_SERVICE,
]

test.describe('routes', () => {
  routesToCheck.forEach((route) => {
    test(`${route.path} should have no accessibility violations`, async ({ page }) => {
      await page.goto(`.${route.path}`)
      await waitMswToStart(page)
      await page.waitForSelector('#app', { timeout: GLOBAL_TIMEOUT })

      const rawAxeResults = await new AxeBuilder({ page })
        .exclude('[data-user-content]')
        .analyze()

      const pageName = route.name

      if (rawAxeResults.violations.length > 0) {
        const reportHTML = createHtmlReport({
          results: rawAxeResults,
          options: {
            projectKey: `Cofolio Backoffice A11y Report - ${pageName}`,
            doNotCreateReportFile: true,
          },
        })
        const reportPath = resolve(__dirname, `reports/${pageName}.html`)

        fs.mkdirSync(dirname(reportPath), { recursive: true })
        fs.writeFileSync(reportPath, reportHTML)
      }

      expect(rawAxeResults.violations.length, 'No accessibility violations').toBe(0)
    })
  })
})
