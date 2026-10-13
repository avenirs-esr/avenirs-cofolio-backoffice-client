import { handlers } from '@/__mocks__/msw/handlers'
import { setupWorker } from 'msw/browser'

export const worker = setupWorker(...handlers)
