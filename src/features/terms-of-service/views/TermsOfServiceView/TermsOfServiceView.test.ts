import type { VueWrapper } from '@vue/test-utils'
import { PageTitleStub } from '@/components/PageTitle/PageTitle.stub'
import TermsOfServiceView from '@/features/terms-of-service/views/TermsOfServiceView/TermsOfServiceView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a terms of service view', () => {
  let wrapper: VueWrapper<InstanceType<typeof TermsOfServiceView>>

  const stubs = { PageTitle: PageTitleStub }

  const mountView = () => {
    wrapper = mount(TermsOfServiceView, { global: { stubs } })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountView()
    })

    BddTest().then('the page title is rendered', () => {
      expect(getPageTitle().exists()).toBe(true)
      expect(getPageTitle().props('title')).toBe('Conditions Générales d\'Utilisation')
    })
  })
})
