import type { VueWrapper } from '@vue/test-utils'
import EmptyState from '@/components/feedback/EmptyState/EmptyState.vue'
import { mountComponent } from '@/tests/utils'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an EmptyState component', () => {
  let wrapper: VueWrapper<InstanceType<typeof EmptyState>>

  const stubs = {
    AvIconText: AvIconTextStub,
  }

  BddTest().when('the component is mounted without props', () => {
    beforeEach(() => {
      wrapper = mountComponent(EmptyState, { global: { stubs } })
    })

    BddTest().then('it should render the root element', () => {
      expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true)
    })

    BddTest().then('it should render the AvIconText component', () => {
      expect(wrapper.findComponent(AvIconTextStub).exists()).toBe(true)
    })

    BddTest().then('it should use the default information icon', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('icon')).toBe(MDI_ICONS.INFORMATION_OUTLINE)
    })

    BddTest().then('it should display the default i18n title', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('text')).toBe('Aucun élément à afficher')
    })

    BddTest().then('it should apply the correct icon color', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('iconColor')).toBe('var(--text2)')
    })

    BddTest().then('it should apply the correct text color', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('textColor')).toBe('var(--text2)')
    })

    BddTest().then('it should apply the b1-regular typography class', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('typographyClass')).toBe('b1-regular')
    })
  })

  BddTest().when('the component is mounted with a custom title', () => {
    const customTitle = 'Aucune inscription en cours ou terminée'

    beforeEach(() => {
      wrapper = mountComponent(EmptyState, {
        props: { title: customTitle },
        global: { stubs },
      })
    })

    BddTest().then('it should display the custom title instead of the default', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('text')).toBe(customTitle)
    })
  })

  BddTest().when('the component is mounted with a custom icon', () => {
    const customIcon = MDI_ICONS.ARROW_RIGHT

    beforeEach(() => {
      wrapper = mountComponent(EmptyState, {
        props: { icon: customIcon },
        global: { stubs },
      })
    })

    BddTest().then('it should display the custom icon instead of the default', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('icon')).toBe(customIcon)
    })
  })
})
