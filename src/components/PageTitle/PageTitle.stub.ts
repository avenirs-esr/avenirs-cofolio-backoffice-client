import type { AvBreadcrumbProps } from '@avenirs-esr/avenirs-dsav'
import type { PropType } from 'vue'

export const PageTitleStub = defineComponent({
  name: 'PageTitle',
  template: '<div data-testid="page-title"><slot name="title" /><slot name="actions" /></div>',
  props: {
    title: {
      type: String,
    },
    trailingLinks: {
      type: Array as PropType<AvBreadcrumbProps['links']>
    },
  },
})
