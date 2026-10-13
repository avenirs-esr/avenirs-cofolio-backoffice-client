import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'

interface IsRouteActiveParams {
  /**
   * The current route object, which contains information about the current route, including its name and matched routes.
   */
  route: RouteLocationNormalizedLoadedGeneric

  /**
   * An array of route objects, each containing a name property. These are the routes against which the current route will be checked for activity.
   */
  routes: Array<{ name: string }>
}

/**
 * Checks if the current route is active based on a list of routes.
 * @param param0 An object containing the current route and the list of routes to check against.
 * @param param0.route The current route object, which contains information about the current route, including its name and matched routes.
 * @param param0.routes An array of route objects, each containing a name property. These are the routes against which the current route will be checked for activity.
 * @returns A boolean indicating whether the current route is active.
 */
export function isRouteActive ({ route, routes }: IsRouteActiveParams): boolean {
  const routeNames = new Set(routes.map(avRoute => avRoute.name))

  if (typeof route.name === 'string' && routeNames.has(route.name)) {
    return true
  }

  return route.matched
    .map(matchedRoute => matchedRoute.name)
    .filter((name): name is string => typeof name === 'string')
    .some(name => routeNames.has(name))
}
