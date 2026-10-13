import { ROUTES } from '@/constants/route-names'

/**
 * Breadcrumb metadata organized by application module.
 */
export const META_BREADCRUMBS = {
  /**
   * Breadcrumb metadata for the home module.
   */
  HOME: { textKey: 'global.MainNavigation.home', to: ROUTES.HOME },

  /**
   * Breadcrumb metadata for the terms of service module.
   */
  TERMS_OF_SERVICE: { textKey: 'global.MainNavigation.termsOfService', to: ROUTES.TERMS_OF_SERVICE },
} as const

/**
 * Breadcrumb paths organized by application module.
 */
export const BASE_BREADCRUMBS = {
  /**
   * Breadcrumb paths for the home module.
   */
  HOME: {
    BASE: [META_BREADCRUMBS.HOME],
  },

  /**
   * Breadcrumb paths for the terms of service module.
   */
  TERMS_OF_SERVICE: {
    BASE: [META_BREADCRUMBS.HOME, META_BREADCRUMBS.TERMS_OF_SERVICE],
  },
}
