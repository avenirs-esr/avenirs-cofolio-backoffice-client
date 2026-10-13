import type { AvRoute } from '@/types/router.types'
import { BASE_BREADCRUMBS, ROUTES } from '@/constants'

export const termsOfServiceRoute: AvRoute = {
  ...ROUTES.TERMS_OF_SERVICE,
  component: () => import('@/features/terms-of-service/views/TermsOfServiceView/TermsOfServiceView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.TERMS_OF_SERVICE.BASE],
  },
}

export const termsOfServiceRoutes = [
  termsOfServiceRoute,
]
