import type { Message } from '@avenirs-esr/avenirs-dsav'
import { defineStore } from 'pinia'

const DEFAULT_TIMEOUT = 5000

export const useToasterStore = defineStore('toaster', () => {
  const messages = reactive<Message[]>([])
  const timeouts: Record<string, number> = {}

  function removeMessage (id: string) {
    const index = messages.findIndex(message => message.id === id)
    clearTimeout(timeouts[id])
    if (index !== -1) {
      messages.splice(index, 1)
    }
  }

  function addMessage (message: Message) {
    if (message.id && timeouts[message.id]) {
      removeMessage(message.id)
    }

    message.id ??= crypto.randomUUID()
    message.titleTag ??= 'h3'
    message.closeable ??= true
    message.type ??= 'info'
    message.timeout ??= DEFAULT_TIMEOUT

    messages.push({ ...message })

    timeouts[message.id] = window.setTimeout(() => {
      removeMessage(message.id as string)
    }, message.timeout)
  }

  function addInfoMessage (msg: Message | string) {
    const message = typeof msg === 'string' ? { description: msg } : msg
    addMessage({ ...message, type: 'info' })
  }

  function addSuccessMessage (msg: Message | string) {
    const message = typeof msg === 'string' ? { description: msg } : msg
    addMessage({ ...message, type: 'success' })
  }

  function addWarningMessage (msg: Message | string) {
    const message = typeof msg === 'string' ? { description: msg } : msg
    addMessage({ ...message, type: 'warning' })
  }

  function addErrorMessage (msg: Message | string) {
    const message = typeof msg === 'string' ? { description: msg } : msg
    addMessage({ ...message, type: 'error' })
  }

  return {
    messages,
    timeouts,
    addMessage,
    removeMessage,
    addInfoMessage,
    addSuccessMessage,
    addWarningMessage,
    addErrorMessage,
  }
})
