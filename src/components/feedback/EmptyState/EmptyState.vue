<script setup lang="ts">
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface EmptyStateProps {
  title?: string
  icon?: string
}

defineProps<EmptyStateProps>()

const { t } = useI18n()
</script>

<template>
  <div
    class="empty-state av-row av-gap-sm av-align-center av-p-md av-radius-lg"
    data-testid="empty-state"
  >
    <AvIconText
      :icon="icon ?? MDI_ICONS.INFORMATION_OUTLINE"
      icon-color="var(--text2)"
      :text="title ?? t('global.EmptyState.defaultTitle')"
      text-color="var(--text2)"
      typography-class="b1-regular"
    />
  </div>
</template>

<style lang="scss" scoped>
.empty-state {
  background-color: var(--surface-background);
}
</style>
