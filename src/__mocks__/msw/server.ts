import { handlers } from '@/__mocks__/msw/handlers'
import { setupServer } from 'msw/node'

export const server = setupServer(...handlers)
