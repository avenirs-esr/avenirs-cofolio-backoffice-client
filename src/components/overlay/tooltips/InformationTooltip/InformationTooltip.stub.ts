export const InformationTooltipStub = defineComponent({
  name: 'InformationTooltip',
  props: {
    content: { type: String, required: true },
    size: { type: Number, required: false }
  },
  template: '<div data-testid="information-tooltip-stub" />'
})
