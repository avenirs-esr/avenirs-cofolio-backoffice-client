<script setup lang="ts">
import type { Slot } from 'vue'
import InformationTooltip from '@/components/overlay/tooltips/InformationTooltip/InformationTooltip.vue'
import { useBreadcrumb } from '@/composables/use-breadcrumb/use-breadcrumb'
import { AvBreadcrumb, type AvBreadcrumbProps } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface PageTitleProps {
  trailingLinks?: AvBreadcrumbProps['links']
  title: string
  informationTooltip?: string
}

const {
  trailingLinks = [],
  title,
} = defineProps<PageTitleProps>()

defineSlots<{
  title?: Slot
  actions?: Slot
}>()

const { t } = useI18n()
const { breadcrumbLinks } = useBreadcrumb(() => trailingLinks)
</script>

<template>
  <div
    class="page-title"
    data-testid="page-title"
  >
    <div class="av-col av-gap-sm av-pb-sm av-gap-xs--md av-pb-xs--md">
      <AvBreadcrumb
        :navigation-label="t('global.breadcrumb.ariaLabel')"
        :show-breadcrumb-label="t('global.breadcrumb.expandButtonLabel')"
        :links="breadcrumbLinks"
      />
      <div class="av-row av-wrap av-align-baseline av-gap-x-md av-gap-y-xs av-justify-between">
        <div class="av-row av-align-center av-gap-md">
          <slot name="title">
            <h1>{{ title }}</h1>
          </slot>
          <InformationTooltip
            v-if="informationTooltip"
            :content="informationTooltip"
            :size="2"
          />
        </div>
        <div class="av-ml-auto">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>
