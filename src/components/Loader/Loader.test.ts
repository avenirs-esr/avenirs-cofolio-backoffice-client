import Loader, { type LoaderColor, type LoaderSize } from '@/components/Loader/Loader.vue'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a loader component', () => {
  let wrapper: VueWrapper<InstanceType<typeof Loader>>

  const stubs = {
    AvIcon: AvIconStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with isLoading true', () => {
    let icon: VueWrapper<InstanceType<typeof AvIconStub>>

    beforeEach(() => {
      wrapper = mount(Loader, {
        props: {
          isLoading: true
        },
        global: { stubs }
      })
      icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
    })

    BddTest().then('it should render the loader container', () => {
      expect(wrapper.find('.loader').exists()).toBe(true)
    })

    BddTest().then('it should have correct layout classes', () => {
      const container = wrapper.find('.loader')
      expect(container.classes()).toContain('av-row')
      expect(container.classes()).toContain('av-justify-center')
      expect(container.classes()).toContain('av-p-xs')
    })

    BddTest().then('it should render the AvIcon component', () => {
      expect(icon.exists()).toBe(true)
    })

    BddTest().then('it should have spin animation', () => {
      expect(icon.props('animation')).toBe('spin')
    })

    BddTest().then('it should use default primary color', () => {
      expect(icon.props('color')).toBe('var(--dark-background-primary1)')
    })

    BddTest().then('it should use default medium size', () => {
      expect(icon.props('size')).toBe(2)
    })
  })

  BddTest().when('the component is mounted with isLoading false and a default slot', () => {
    beforeEach(() => {
      wrapper = mount(Loader, {
        props: {
          isLoading: false
        },
        slots: {
          default: '<div class="slot-content">Content loaded</div>'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should not render the loader container', () => {
      expect(wrapper.find('.loader').exists()).toBe(false)
    })

    BddTest().then('it should not render the AvIcon component', () => {
      const icon = wrapper.findComponent({ name: 'AvIcon' })
      expect(icon.exists()).toBe(false)
    })

    BddTest().then('it should render the slot content', () => {
      const slotContent = wrapper.find('.slot-content')
      expect(slotContent.exists()).toBe(true)
      expect(slotContent.text()).toBe('Content loaded')
    })
  })

  BddTest().when('the component is mounted with isLoading false and no default slot', () => {
    beforeEach(() => {
      wrapper = mount(Loader, {
        props: {
          isLoading: false
        },
        global: { stubs }
      })
    })

    BddTest().then('it should not render the loader container', () => {
      expect(wrapper.find('.loader').exists()).toBe(false)
    })

    BddTest().then('it should not render the AvIcon component', () => {
      const icon = wrapper.findComponent({ name: 'AvIcon' })
      expect(icon.exists()).toBe(false)
    })

    BddTest().then('it should render an empty div from the default slot', () => {
      const slotDiv = wrapper.find('[data-testid="loader-slot-alt"]')
      expect(slotDiv.exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted without isLoading prop and a default slot', () => {
    beforeEach(() => {
      wrapper = mount(Loader, {
        slots: {
          default: '<div class="default-slot">Default content</div>'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the slot content by default', () => {
      const slotContent = wrapper.find('.default-slot')
      expect(slotContent.exists()).toBe(true)
    })

    BddTest().then('it should not render the loader', () => {
      expect(wrapper.find('.loader').exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted without isLoading prop and no default slot', () => {
    beforeEach(() => {
      wrapper = mount(Loader, {
        global: { stubs }
      })
    })

    BddTest().then('it should render an empty div from the default slot', () => {
      const slotDiv = wrapper.find('[data-testid="loader-slot-alt"]')
      expect(slotDiv.exists()).toBe(true)
    })

    BddTest().then('it should not render the loader', () => {
      expect(wrapper.find('.loader').exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with custom colors and isLoading true', () => {
    BddTest().and('color is set to primary', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { color: 'primary' as LoaderColor, isLoading: true },
          global: { stubs }
        })
      })

      BddTest().then('it should apply primary color variable', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('color')).toBe('var(--dark-background-primary1)')
      })
    })

    BddTest().and('color is set to accent', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { color: 'accent' as LoaderColor, isLoading: true },
          global: { stubs }
        })
      })

      BddTest().then('it should apply accent color variable', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('color')).toBe('var(--dark-background-accent)')
      })
    })

    BddTest().and('color is set to success', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { color: 'success' as LoaderColor, isLoading: true },
          global: { stubs }
        })
      })

      BddTest().then('it should apply success color variable', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('color')).toBe('var(--dark-background-success)')
      })
    })

    BddTest().and('color is set to info', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { color: 'info' as LoaderColor, isLoading: true },
          global: { stubs }
        })
      })

      BddTest().then('it should apply info color variable', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('color')).toBe('var(--dark-background-info)')
      })
    })

    BddTest().and('color is set to warn', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { color: 'warn' as LoaderColor, isLoading: true },
          global: { stubs }
        })
      })

      BddTest().then('it should apply warn color variable', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('color')).toBe('var(--dark-background-warn)')
      })
    })

    BddTest().and('color is set to error', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { color: 'error' as LoaderColor, isLoading: true },
          global: { stubs }
        })
      })

      BddTest().then('it should apply error color variable', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('color')).toBe('var(--dark-background-error)')
      })
    })

    BddTest().and('color is set to neutral', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { color: 'neutral' as LoaderColor, isLoading: true },
          global: { stubs }
        })
      })

      BddTest().then('it should apply neutral color variable', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('color')).toBe('var(--dark-background-neutral)')
      })
    })
  })

  BddTest().when('the component is mounted with custom sizes and isLoading true', () => {
    BddTest().and('size is set to xs', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { size: 'xs' as LoaderSize, isLoading: true },
          global: { stubs }
        })
      })

      BddTest().then('it should apply xs size value', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('size')).toBe(1)
      })
    })

    BddTest().and('size is set to sm', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { size: 'sm' as LoaderSize, isLoading: true },
          global: { stubs }
        })
      })

      BddTest().then('it should apply sm size value', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('size')).toBe(1.5)
      })
    })

    BddTest().and('size is set to md', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { size: 'md' as LoaderSize, isLoading: true },
          global: { stubs }
        })
      })

      BddTest().then('it should apply md size value', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('size')).toBe(2)
      })
    })

    BddTest().and('size is set to lg', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { size: 'lg' as LoaderSize, isLoading: true },
          global: { stubs }
        })
      })

      BddTest().then('it should apply lg size value', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('size')).toBe(2.5)
      })
    })

    BddTest().and('size is set to xl', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { size: 'xl' as LoaderSize, isLoading: true },
          global: { stubs }
        })
      })

      BddTest().then('it should apply xl size value', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('size')).toBe(3)
      })
    })

    BddTest().and('size is set to 2xl', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { size: '2xl' as LoaderSize, isLoading: true },
          global: { stubs }
        })
      })

      BddTest().then('it should apply 2xl size value', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('size')).toBe(4)
      })
    })

    BddTest().and('size is set to 4xl', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { size: '4xl' as LoaderSize, isLoading: true },
          global: { stubs }
        })
      })

      BddTest().then('it should apply 4xl size value', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('size')).toBe(5)
      })
    })
  })
})
