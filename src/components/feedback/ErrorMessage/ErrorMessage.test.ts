import type { VueWrapper } from '@vue/test-utils'
import ErrorMessage, { type ErrorMessageProps } from '@/components/feedback/ErrorMessage/ErrorMessage.vue'
import { mountComponent } from '@/tests/utils'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

BddTest().given('an ErrorMessage component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ErrorMessage>>

  const defaultProps = {
    title: '404 - Page introuvable',
    description: 'La page que vous recherchez n\'existe pas.',
  }

  const mountWith = (props: ErrorMessageProps) => {
    wrapper = mountComponent(ErrorMessage, {
      props,
      global: { stubs: { AvIcon: AvIconStub } },
    })
  }

  const getTitle = () => wrapper.find('[data-testid="error-message-title"]')
  const getDescription = () => wrapper.find('[data-testid="error-message-description"]')
  const getAvIcon = () => wrapper.findComponent(AvIconStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith(defaultProps)
    })

    BddTest().then('it should render the title and description', () => {
      expect(getTitle().text()).toBe(defaultProps.title)
      expect(getDescription().text()).toBe(defaultProps.description)
    })

    BddTest().then('it should render the icon', () => {
      expect(getAvIcon().exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted without props', () => {
    beforeEach(() => {
      mountWith({})
    })

    BddTest().then('it should render the generic error as title', () => {
      expect(getTitle().text()).toBe('Une erreur est survenue. Veuillez réessayer ultérieurement.')
    })

    BddTest().then('it should not render the description', () => {
      expect(getDescription().exists()).toBe(false)
    })
  })
})
