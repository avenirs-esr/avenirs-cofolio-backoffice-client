<script setup lang="ts">
import { ROUTES } from '@/constants'
import { termsOfServiceRoutes } from '@/features/terms-of-service/routes'
import { isRouteActive } from '@/utils/route/route'
import { AvNavigation, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

const navItems = computed(() => [
  {
    id: 'nav-home',
    to: ROUTES.HOME,
    text: t('global.MainNavigation.home').toUpperCase(),
    icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
  },
  {
    id: 'nav-terms-of-service',
    to: ROUTES.TERMS_OF_SERVICE,
    text: t('global.MainNavigation.termsOfService').toUpperCase(),
    icon: MDI_ICONS.FILE_DOCUMENT_EDIT_OUTLINE,
    highlight: isRouteActive({ route, routes: termsOfServiceRoutes }),
  },
])
</script>

<template>
  <AvNavigation
    :nav-items="navItems"
    data-testid="main-navigation"
  />
</template>
