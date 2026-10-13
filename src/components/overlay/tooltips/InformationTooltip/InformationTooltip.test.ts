import InformationTooltip, { type InformationTooltipProps } from '@/components/overlay/tooltips/InformationTooltip/InformationTooltip.vue'
import { AvIconStub, AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('an information tooltip component', () => {
  let wrapper: VueWrapper<InstanceType<typeof InformationTooltip>>

  const stubs = { AvTooltip: AvTooltipStub, AvIcon: AvIconStub }

  const mountWithProps = (props: InformationTooltipProps) => {
    return mount(InformationTooltip, { props, global: { stubs } })
  }

  const getAvTooltip = () => wrapper.findComponent(AvTooltipStub)
  const getAvIcon = () => wrapper.findComponent(AvIconStub)

  BddTest().when('the component is mounted without a size prop', () => {
    beforeEach(() => {
      wrapper = mountWithProps({ content: 'Test content' })
    })

    BddTest().then('it should render the tooltip with the content', () => {
      expect(getAvTooltip().props('content')).toBe('Test content')
    })

    BddTest().then('it should provide an accessible label for the trigger', () => {
      expect(getAvTooltip().props('triggerAriaLabel')).toBe('Informations')
    })

    BddTest().then('it should not pass size prop to AvIcon', () => {
      expect(getAvIcon().props('size')).toBeUndefined()
    })
  })

  BddTest().when('the component is mounted with a size prop', () => {
    beforeEach(() => {
      wrapper = mountWithProps({ content: 'Test content', size: 2 })
    })

    BddTest().then('it should pass size prop to AvIcon', () => {
      expect(getAvIcon().props('size')).toBe(2)
    })
  })
})
