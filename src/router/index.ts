import { ROUTES } from '@/constants'
import { termsOfServiceRoutes } from '@/features/terms-of-service/routes'
import { createRouter, createWebHistory } from 'vue-router'

const MAIN_TITLE = 'Cofolio'

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
  scrollBehavior: (to, _from, savedPosition) => {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    if (savedPosition) {
      return savedPosition
    }

    if (window.history.state?.preserveScroll) {
      return false
    }

    return { top: 0 }
  }
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

  const specificTitle = to.meta.title ? `${to.meta.title} - ` : ''
  document.title = `${specificTitle}${MAIN_TITLE}`
})

export default router
