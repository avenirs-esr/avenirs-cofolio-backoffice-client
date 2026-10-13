<script setup lang="ts">
import { ROUTES } from '@/constants'
import { AvButton } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface NotFoundViewProps {
  titleKey?: string
  descriptionKey?: string
}

const {
  titleKey = 'global.views.NotFoundView.pageNotFound.title',
  descriptionKey = 'global.views.NotFoundView.pageNotFound.description'
} = defineProps<NotFoundViewProps>()

const { t } = useI18n()

const title = computed(() => t(titleKey))
const description = computed(() => t(descriptionKey))
</script>

<template>
  <div class="av-col av-align-center av-justify-center av-gap-lg">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>

    <AvButton
      :label="t('global.views.NotFoundView.buttonLabel')"
      :to="ROUTES.HOME"
      size="LG"
    />
  </div>
</template>
