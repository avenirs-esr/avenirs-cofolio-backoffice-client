export const LoaderStub = defineComponent({
  name: 'Loader',
  props: ['color', 'size', 'isLoading'],
  template: `
    <div v-if="isLoading" data-testid="loader-stub" class="loader-stub"></div>
    <template v-else>
      <slot />
    </template>
  `
})
