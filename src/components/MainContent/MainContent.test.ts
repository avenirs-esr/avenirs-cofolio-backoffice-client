import type { VueWrapper } from '@vue/test-utils'
import MainContent from '@/components/MainContent/MainContent.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'

BddTest().given('a MainContent component', () => {
  let wrapper: VueWrapper<InstanceType<typeof MainContent>>

  BddTest().when('the component is mounted without slot', () => {
    beforeEach(() => {
      wrapper = mount(MainContent)
    })

    BddTest().then('it should render the main content', () => {
      expect(wrapper.find('[data-testid="main-content"]').exists()).toBe(true)
      expect(wrapper.find('main').exists()).toBe(true)
      expect(wrapper.find('#main').exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted with slot content', () => {
    const slotContent = '<p>Slot content</p>'

    beforeEach(() => {
      wrapper = mount(MainContent, {
        slots: {
          default: slotContent,
        },
      })
    })

    BddTest().then('it should render the slot content', () => {
      expect(wrapper.find('[data-testid="main-content"]').html()).toContain(slotContent)
    })
  })
})
