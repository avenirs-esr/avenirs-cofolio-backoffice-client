<script setup lang="ts">
import { AvIcon, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ErrorMessageProps {
  title?: string
  description?: string
}

const { title, description } = defineProps<ErrorMessageProps>()
const { t } = useI18n()
</script>

<template>
  <div
    role="alert"
    class="av-error-message av-col av-align-center av-justify-center av-gap-sm"
    data-testid="error-message"
  >
    <AvIcon
      :name="MDI_ICONS.ALERT_OUTLINE"
      :size="2.5"
      color="var(--dark-background-error)"
    />
    <div class="av-col av-align-center av-gap-sm av-text-center">
      <span
        class="n6"
        data-testid="error-message-title"
      >
        {{ title ?? t('global.error.generic') }}
      </span>
      <p
        v-if="description"
        class="b1-regular"
        data-testid="error-message-description"
      >
        {{ description }}
      </p>
    </div>
  </div>
</template>
