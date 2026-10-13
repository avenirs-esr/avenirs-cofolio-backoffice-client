<script setup lang="ts">
import { AvSkipLinks, type AvSkipLinksProps } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const skipLinks: AvSkipLinksProps['skipLinks'] = [
  {
    id: 'main',
    label: t('global.navigation.SkipLinks.main'),
  },
  {
    id: 'footer',
    label: t('global.navigation.SkipLinks.footer'),
  }
]
</script>

<template>
  <AvSkipLinks
    :skip-links="skipLinks"
    :aria-label="t('global.navigation.SkipLinks.ariaLabel')"
  />
</template>
