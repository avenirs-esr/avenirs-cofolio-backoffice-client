import type { VueWrapper } from '@vue/test-utils'
import ErrorMessage from '@/components/feedback/ErrorMessage/ErrorMessage.vue'
import { mountComponent } from '@/tests/utils'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

BddTest().given('an ErrorMessage component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ErrorMessage>>

  const props = {
    title: '404 - Page introuvable',
    description: 'La page que vous recherchez n\'existe pas.',
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(ErrorMessage, {
        props,
        global: {
          stubs: {
            AvIcon: AvIconStub,
          },
        },
      })
    })

    BddTest().then('it should render the title and description', () => {
      expect(wrapper.find('[data-testid="error-message-title"]').text()).toBe(props.title)
      expect(wrapper.find('[data-testid="error-message-description"]').text()).toBe(props.description)
    })

    BddTest().then('it should render the icon', () => {
      expect(wrapper.findComponent(AvIconStub).exists()).toBe(true)
    })
  })
})
