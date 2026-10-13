export const ErrorMessageStub = defineComponent({
  name: 'ErrorMessage',
  props: ['title', 'description'],
  template: `
    <div data-testid="error-message">
      <h3 data-testid="error-message-title">{{ title }}</h3>
      <p data-testid="error-message-description">{{ description }}</p>
    </div>
  `,
})
