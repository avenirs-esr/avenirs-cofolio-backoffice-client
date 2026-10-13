import type { PageTitleProps } from '@/components/PageTitle/PageTitle.vue'
import type { AvBreadcrumbProps } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import { InformationTooltipStub } from '@/components/overlay/tooltips/InformationTooltip/InformationTooltip.stub'
import PageTitle from '@/components/PageTitle/PageTitle.vue'
import { mountWithRouter } from '@/tests/utils'
import { AvBreadcrumbStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const breadcrumbLinks = ref<AvBreadcrumbProps['links']>([])

vi.mock('@/composables/use-breadcrumb/use-breadcrumb', () => ({
  useBreadcrumb: (trailingLinks: () => AvBreadcrumbProps['links']) => ({
    breadcrumbLinks: computed(() => [
      ...breadcrumbLinks.value,
      ...trailingLinks()
    ])
  })
}))

BddTest().given('a page title', () => {
  let wrapper: VueWrapper<InstanceType<typeof PageTitle>>

  const trailingLinks = [
    { text: 'Home', to: '/' },
    { text: 'Page name' }
  ]
  const props: PageTitleProps = {
    trailingLinks,
    title: 'Page title',
    informationTooltip: 'This is an information tooltip'
  }

  const stubs = { AvBreadcrumb: AvBreadcrumbStub, InformationTooltip: InformationTooltipStub }

  const getInformationTooltip = () => wrapper.findComponent(InformationTooltipStub)
  const getAvBreadCrumb = () => wrapper.findComponent(AvBreadcrumbStub)

  beforeEach(async () => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with provided props', () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter<typeof PageTitle>(PageTitle, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render properly', () => {
      expect(getAvBreadCrumb().props('links')).toStrictEqual(trailingLinks)

      const pageTitle = wrapper.find('.page-title')
      const titleElement = pageTitle.find('h1')
      expect(titleElement.text()).toBe(props.title)

      const informationTooltip = getInformationTooltip()
      expect(informationTooltip.exists()).toBe(true)
      expect(informationTooltip.props('content')).toBe(props.informationTooltip)
    })
  })

  BddTest().when('the component is mounted without informationTooltip', () => {
    beforeEach(async () => {
      const { informationTooltip, ...propsWithoutTooltip } = props
      wrapper = await mountWithRouter<typeof PageTitle>(PageTitle, {
        props: propsWithoutTooltip,
        global: { stubs }
      })
    })

    BddTest().then('it should not render the information tooltip', () => {
      expect(getInformationTooltip().exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted and useBreadcrumb returns breadcrumb links', () => {
    beforeEach(async () => {
      breadcrumbLinks.value = [{ text: 'First', to: '/' }, { text: 'Second' }]
      wrapper = await mountWithRouter<typeof PageTitle>(PageTitle, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the breadcrumb with the links from useBreadcrumb', () => {
      expect(getAvBreadCrumb().props('links')).toStrictEqual([...breadcrumbLinks.value, ...trailingLinks])
    })
  })

  BddTest().when('the component is mounted with the title slot', () => {
    const slotTitle = 'Slot Page Title'

    beforeEach(async () => {
      wrapper = await mountWithRouter<typeof PageTitle>(PageTitle, {
        props,
        slots: {
          title: `<h1 class="slot-title">${slotTitle}</h1>`
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the slot title instead of the prop title', () => {
      const pageTitle = wrapper.find('.page-title')
      const slotTitleElement = pageTitle.find('.slot-title')
      expect(slotTitleElement.text()).toBe(slotTitle)
    })
  })

  BddTest().when('the component is mounted with the actions slot', () => {
    const slotActions = 'Slot Actions'

    beforeEach(async () => {
      wrapper = await mountWithRouter<typeof PageTitle>(PageTitle, {
        props,
        slots: {
          actions: `<div class="slot-actions">${slotActions}</div>`
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the actions slot', () => {
      const pageTitle = wrapper.find('.page-title')
      const slotActionsElement = pageTitle.find('.slot-actions')
      expect(slotActionsElement.text()).toBe(slotActions)
    })
  })
})
