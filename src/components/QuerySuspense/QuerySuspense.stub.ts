export const QuerySuspenseStub = defineComponent({
  name: 'QuerySuspense',
  template: `
    <div data-testid="query-suspense-stub">
      <div v-if="isLoading" data-testid="query-suspense-loading" />
      <slot name="error" v-else-if="error">
        <div data-testid="query-suspense-error">
          <h2>{{ errorTitle }}</h2>
          <p>{{ errorDescription }}</p>
        </div>
      </slot>
      <slot name="empty" v-else-if="isEmpty">
        <div data-testid="query-suspense-empty">
          <span>{{ emptyStateMessage }}</span>
        </div>
      </slot>
      <slot v-else />
    </div>
  `,
  props: {
    error: {
      type: Object,
      default: null,
    },
    errorTitle: {
      type: String,
    },
    errorDescription: {
      type: String,
    },
    emptyStateMessage: {
      type: String,
    },
    isEmpty: {
      type: Boolean,
    },
    isLoading: {
      type: Boolean,
    },
  }
})
