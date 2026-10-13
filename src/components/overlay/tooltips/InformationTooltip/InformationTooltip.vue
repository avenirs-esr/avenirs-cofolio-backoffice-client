<script lang="ts" setup>
import { AvIcon, AvTooltip, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface InformationTooltipProps {
  content: string
  size?: number
}

defineProps<InformationTooltipProps>()

const { t } = useI18n()
</script>

<template>
  <AvTooltip
    :content="content"
    :trigger-aria-label="t('global.overlay.InformationTooltip.triggerAriaLabel')"
    force-focusable
    data-testid="information-tooltip"
  >
    <AvIcon
      :name="MDI_ICONS.QUESTION_MARK_CIRCLE_OUTLINE"
      color="var(--dark-background-info)"
      :size="size"
    />
  </AvTooltip>
</template>
