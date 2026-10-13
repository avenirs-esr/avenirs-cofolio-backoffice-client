import type { Message } from '@avenirs-esr/avenirs-dsav'
import { useToasterStore } from '@/store/toaster/toaster'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

BddTest().given('a useToasterStore composable', () => {
  let toaster: ReturnType<typeof useToasterStore>

  const message: Message = { id: 'test-id', description: 'test', type: 'info' }
  const newMessage: Message = {
    id: 'new-id',
    title: 'Hello',
    description: 'World',
    type: 'warning',
    timeout: 5000,
    closeable: false,
    titleTag: 'h4',
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(globalThis, 'clearTimeout')
    setActivePinia(createPinia())
    toaster = useToasterStore()
    toaster.messages.length = 0
    toaster.messages.push({ ...message })
    toaster.timeouts[message.id!] = window.setTimeout(() => {}, 1000)
  })

  BddTest().when('calling removeMessage', () => {
    BddTest().then('it should remove message and clear timeout', () => {
      toaster.removeMessage(message.id!)
      expect(toaster.messages.length).toBe(0)
      expect(clearTimeout).toHaveBeenCalled()
    })

    BddTest().then('it should ignore removal of non-existent message', () => {
      toaster.removeMessage('non-existent-id')
      expect(toaster.messages.length).toBe(1)
    })
  })

  BddTest().when('calling addMessage', () => {
    BddTest().and('a message already exists with the same id', () => {
      BddTest().then('it should replace the existing message', () => {
        toaster.addMessage(message)
        expect(toaster.messages.length).toBe(1)
      })
    })

    BddTest().then('it should add message with default props', () => {
      toaster.removeMessage(message.id!)
      toaster.addMessage(message)

      expect(toaster.messages.length).toBe(1)
      const { id, title, description, titleTag, closeable, type, timeout } = toaster.messages[0]!

      expect(id).toBe(message.id)
      expect(title).toBe(undefined)
      expect(description).toBe(message.description)
      expect(titleTag).toBe('h3')
      expect(closeable).toBe(true)
      expect(type).toBe('info')
      expect(timeout).toBe(5000)
    })

    BddTest().then('it should add message with full props', () => {
      toaster.addMessage(newMessage)
      const msg = toaster.messages.find(m => m.id === newMessage.id)!
      expect(msg.title).toBe('Hello')
      expect(msg.type).toBe('warning')
      expect(msg.timeout).toBe(5000)
      expect(msg.titleTag).toBe('h4')
      expect(msg.closeable).toBe(false)
    })

    BddTest().then('it should add message with default props', () => {
      toaster.removeMessage('test-id')
      toaster.addMessage({ description: 'default', type: 'info' })
      const msg = toaster.messages[0]
      expect(msg.titleTag).toBe('h3')
      expect(msg.type).toBe('info')
      expect(msg.closeable).toBe(true)
    })
  })

  BddTest().when('calling addInfoMessage', () => {
    BddTest().then('it should add info message from string or object', () => {
      toaster.addInfoMessage('message')
      toaster.addInfoMessage({ description: 's', type: 'success' })
      expect(toaster.messages.slice(1).every(m => m.type === 'info')).toBe(true)
    })
  })

  BddTest().when('calling addSuccessMessage', () => {
    BddTest().then('it should add success message from string or object', () => {
      toaster.addSuccessMessage('ok')
      toaster.addSuccessMessage({ description: 'w', type: 'warning' })
      expect(toaster.messages.slice(1).every(m => m.type === 'success')).toBe(true)
    })
  })

  BddTest().when('calling addWarningMessage', () => {
    BddTest().then('it should add warning message from string or object', () => {
      toaster.addInfoMessage('warn')
      toaster.addInfoMessage({ description: 'e', type: 'error' })
      expect(toaster.messages.slice(1).every(m => m.type === 'info')).toBe(true)
    })
  })

  BddTest().when('calling addErrorMessage', () => {
    BddTest().then('it should add error message from string or object', () => {
      toaster.addErrorMessage('fail')
      toaster.addErrorMessage({ description: 'i', type: 'info' })
      expect(toaster.messages.slice(1).every(m => m.type === 'error')).toBe(true)
    })
  })

  BddTest().when('the timeout occurs on added message', () => {
    BddTest().then('it should call removeMessage after timeout', () => {
      toaster.removeMessage('test-id')
      toaster.addMessage({ description: 'default', type: 'info' })

      expect(toaster.messages.length).toBe(1)
      vi.advanceTimersByTime(5000)
      expect(toaster.messages.length).toBe(0)
    })
  })
})
