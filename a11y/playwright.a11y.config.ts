import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

export const GLOBAL_TIMEOUT = 60 * 1000
export default defineConfig({
  testDir: './',
  tsconfig: './tsconfig.a11y.json',
  use: {
    baseURL: 'http://localhost:4173/cofolio/',
    headless: !!process.env.CI,
  },
  timeout: GLOBAL_TIMEOUT,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  workers: process.env.CI ? 1 : undefined,

  outputDir: '.output',

  webServer: {
    command: 'npm run preview:development',
    port: 4173,
    reuseExistingServer: true,
    cwd: '../',
  },
})
