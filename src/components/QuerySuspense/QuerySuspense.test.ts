import type { VueWrapper } from '@vue/test-utils'
import { EmptyStateStub } from '@/components/feedback/EmptyState/EmptyState.stub'
import { ErrorMessageStub } from '@/components/feedback/ErrorMessage/ErrorMessage.stub'
import { LoaderStub } from '@/components/Loader/Loader.stub'
import QuerySuspense from '@/components/QuerySuspense/QuerySuspense.vue'
import { BaseApiException } from '@/exceptions'
import { mountComponent } from '@/tests/utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  EmptyState: EmptyStateStub,
  ErrorMessage: ErrorMessageStub,
  Loader: LoaderStub,
}

const defaultProps = {
  errorTitle: 'Erreur de chargement',
  emptyStateMessage: 'Aucune association',
  isEmpty: false,
}

BddTest().given('a QuerySuspense component', () => {
  let wrapper: VueWrapper<InstanceType<typeof QuerySuspense>>

  BddTest().when('there is no error and content is not empty', () => {
    beforeEach(() => {
      wrapper = mountComponent(QuerySuspense, {
        props: { ...defaultProps, isEmpty: false },
        slots: { default: '<div data-testid="slot-content">Contenu</div>' },
        global: { stubs }
      })
    })

    BddTest().then('it should render the slot content', () => {
      expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(true)
    })

    BddTest().then('it should not render ErrorMessage', () => {
      expect(wrapper.findComponent(ErrorMessageStub).exists()).toBe(false)
    })

    BddTest().then('it should not render EmptyState', () => {
      expect(wrapper.findComponent(EmptyStateStub).exists()).toBe(false)
    })
  })

  BddTest().when('isEmpty is true and there is no error', () => {
    beforeEach(() => {
      wrapper = mountComponent(QuerySuspense, {
        props: { ...defaultProps, isEmpty: true },
        slots: { default: '<div data-testid="slot-content">Contenu</div>' },
        global: { stubs }
      })
    })

    BddTest().then('it should render EmptyState with the correct title', () => {
      const emptyState = wrapper.findComponent(EmptyStateStub)
      expect(emptyState.exists()).toBe(true)
      expect(emptyState.props('title')).toBe('Aucune association')
    })

    BddTest().then('it should not render the slot content', () => {
      expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(false)
    })

    BddTest().then('it should not render ErrorMessage', () => {
      expect(wrapper.findComponent(ErrorMessageStub).exists()).toBe(false)
    })
  })

  BddTest().when('isEmpty is true and a custom empty slot is provided', () => {
    beforeEach(() => {
      wrapper = mountComponent(QuerySuspense, {
        props: { ...defaultProps, isEmpty: true },
        slots: { empty: '<div data-testid="custom-empty">État vide personnalisé</div>' },
        global: { stubs }
      })
    })

    BddTest().then('it should render the custom empty slot', () => {
      expect(wrapper.find('[data-testid="custom-empty"]').exists()).toBe(true)
    })

    BddTest().then('it should not render EmptyState', () => {
      expect(wrapper.findComponent(EmptyStateStub).exists()).toBe(false)
    })
  })

  BddTest().when('there is an error', () => {
    const error = new BaseApiException('Une erreur est survenue')

    beforeEach(() => {
      wrapper = mountComponent(QuerySuspense, {
        props: { ...defaultProps, error, isEmpty: false },
        slots: { default: '<div data-testid="slot-content">Contenu</div>' },
        global: { stubs }
      })
    })

    BddTest().then('it should render ErrorMessage with the correct title and description', () => {
      const errorMessage = wrapper.findComponent(ErrorMessageStub)
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.props('title')).toBe('Erreur de chargement')
      expect(errorMessage.props('description')).toBeDefined()
    })

    BddTest().then('it should not render EmptyState', () => {
      expect(wrapper.findComponent(EmptyStateStub).exists()).toBe(false)
    })

    BddTest().then('it should not render the slot content', () => {
      expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(false)
    })
  })

  BddTest().when('there is an error and a custom error slot is provided', () => {
    const error = new BaseApiException('Une erreur est survenue')

    beforeEach(() => {
      wrapper = mountComponent(QuerySuspense, {
        props: { ...defaultProps, error, isEmpty: false },
        slots: { error: '<div data-testid="custom-error">Erreur personnalisée</div>' },
        global: { stubs }
      })
    })

    BddTest().then('it should render the custom error slot', () => {
      expect(wrapper.find('[data-testid="custom-error"]').exists()).toBe(true)
    })

    BddTest().then('it should not render ErrorMessage', () => {
      expect(wrapper.findComponent(ErrorMessageStub).exists()).toBe(false)
    })
  })

  BddTest().when('there is an error and isEmpty is true', () => {
    const error = new BaseApiException('Une erreur est survenue')

    beforeEach(() => {
      wrapper = mountComponent(QuerySuspense, {
        props: { ...defaultProps, error, isEmpty: true },
        global: { stubs }
      })
    })

    BddTest().then('it should render ErrorMessage and not EmptyState', () => {
      expect(wrapper.findComponent(ErrorMessageStub).exists()).toBe(true)
      expect(wrapper.findComponent(EmptyStateStub).exists()).toBe(false)
    })
  })

  BddTest().when('isLoading is true', () => {
    beforeEach(() => {
      wrapper = mountComponent(QuerySuspense, {
        props: { ...defaultProps, isLoading: true },
        slots: { default: '<div data-testid="slot-content">Contenu</div>' },
        global: { stubs }
      })
    })

    BddTest().then('it should render the Loader', () => {
      expect(wrapper.find('[data-testid="loader-stub"]').exists()).toBe(true)
    })

    BddTest().then('it should not render the slot content', () => {
      expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(false)
    })

    BddTest().then('it should not render ErrorMessage', () => {
      expect(wrapper.findComponent(ErrorMessageStub).exists()).toBe(false)
    })

    BddTest().then('it should not render EmptyState', () => {
      expect(wrapper.findComponent(EmptyStateStub).exists()).toBe(false)
    })
  })

  BddTest().when('isLoading is false', () => {
    beforeEach(() => {
      wrapper = mountComponent(QuerySuspense, {
        props: { ...defaultProps, isLoading: false },
        slots: { default: '<div data-testid="slot-content">Contenu</div>' },
        global: { stubs }
      })
    })

    BddTest().then('it should not render the Loader', () => {
      expect(wrapper.find('[data-testid="loader-stub"]').exists()).toBe(false)
    })

    BddTest().then('it should render the slot content', () => {
      expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(true)
    })
  })

  BddTest().when('no errorTitle is provided', () => {
    const error = new BaseApiException('Une erreur est survenue')

    beforeEach(() => {
      wrapper = mountComponent(QuerySuspense, {
        props: { isEmpty: false, error },
        global: { stubs }
      })
    })

    BddTest().then('it should render ErrorMessage with the default i18n title', () => {
      const errorMessage = wrapper.findComponent(ErrorMessageStub)
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.props('title')).toBe('Une erreur est survenue lors du chargement des données')
    })
  })

  BddTest().when('no emptyStateMessage is provided', () => {
    beforeEach(() => {
      wrapper = mountComponent(QuerySuspense, {
        props: { isEmpty: true },
        global: { stubs }
      })
    })

    BddTest().then('it should render EmptyState with the default i18n message', () => {
      const emptyState = wrapper.findComponent(EmptyStateStub)
      expect(emptyState.exists()).toBe(true)
      expect(emptyState.props('title')).toBe('Aucune donnée à afficher')
    })
  })
})
