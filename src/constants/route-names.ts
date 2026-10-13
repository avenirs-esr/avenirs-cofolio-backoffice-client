/**
 * Route names and paths organized by application module.
 */
export const ROUTES = {
  /**
   * Route names and paths for the home module.
   */
  HOME: { name: 'home', path: '/' },

  /**
   * Route names and paths for the terms of service module.
   */
  TERMS_OF_SERVICE: { name: 'terms-of-service', path: '/terms-of-service' },
} as const
