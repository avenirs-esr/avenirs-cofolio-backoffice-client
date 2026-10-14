import { ROUTES } from '@/constants'
import { termsOfServiceRoutes } from '@/features/terms-of-service/routes'
import { getPageTitle, scrollBehavior } from '@/router/router.utils'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  ...termsOfServiceRoutes,
  {
    ...ROUTES.HOME,
    component: { render: () => null },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView/NotFoundView.vue'),
    props: {
      titleKey: 'global.views.NotFoundView.pageNotFound.title',
      descriptionKey: 'global.views.NotFoundView.pageNotFound.description'
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env?.BASE_URL || ''),
  routes,
  scrollBehavior
})

router.beforeEach(async (to) => { // Cf. https://github.com/vueuse/head pour des transformations avancées de Head
  /* COFOLIO auth handling */
  // if (to.meta.public !== true) {
  //   const { useAuthStore } = await import('@/features/auth/global/stores/auth.store')
  //   const authStore = useAuthStore()
  //   const toAuth = await authStore.ensureAuthenticated({ to, delegated: true })
  //   if (toAuth !== undefined) {
  //     return toAuth
  //   }

  //   if (to.name === 'home') {
  //     return authStore.homeRoute
  //   }

  //   const allowedCategories = to.meta.roles as EUserCategory[] | undefined
  //   if (!__ENABLE_MSW__ && allowedCategories !== undefined && !allowedCategories.some(allowedCategory => authStore.categories.includes(allowedCategory))) {
  //     return authStore.homeRoute
  //   }

  //   const cguRedirect = resolveCguRedirect(to, authStore.hasAcceptedLatestCgu)
  //   if (cguRedirect !== undefined) {
  //     return cguRedirect
  //   }
  // }

  document.title = getPageTitle(to.meta.title as string | null | undefined)
})

export default router
