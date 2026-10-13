import { ROUTES } from '@/constants'
import NotFoundView from '@/views/NotFoundView/NotFoundView.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a not found view', () => {
  let wrapper: VueWrapper<InstanceType<typeof NotFoundView>>

  BddTest().when('the view is mounted with default props', () => {
    beforeEach(() => {
      wrapper = mount(NotFoundView, {
        global: {
          stubs: {
            AvButton: AvButtonStub,
          },
        },
      })
    })

    BddTest().then('it should render default title/description and the button label', () => {
      expect(wrapper.find('h3').text()).toBe('404 - Page introuvable')
      expect(wrapper.find('p').text()).toBe('La page que vous recherchez n\'existe pas ou plus.')
      expect(wrapper.findComponent(AvButtonStub).text()).toBe('Retour à l\'accueil')
    })

    BddTest().then('it should render the button as a router link to home', () => {
      expect(wrapper.findComponent(AvButtonStub).props('to')).toEqual(ROUTES.HOME)
    })
  })

  BddTest().when('the view is mounted with custom translation keys', () => {
    beforeEach(() => {
      wrapper = mount(NotFoundView, {
        props: {
          titleKey: 'global.text',
          descriptionKey: 'global.text',
        },
        global: {
          stubs: {
            AvButton: AvButtonStub,
          },
        },
      })
    })

    BddTest().then('it should render the title/description from the given keys', () => {
      expect(wrapper.find('h3').text()).toBe('Texte')
      expect(wrapper.find('p').text()).toBe('Texte')
    })
  })
})
