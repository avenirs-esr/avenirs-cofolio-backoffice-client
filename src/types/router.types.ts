import type {
  RouteLocationNormalizedLoaded,
  RouteLocationRaw,
  RouteRecordMultipleViews,
  RouteRecordMultipleViewsWithChildren,
  RouteRecordSingleView,
  RouteRecordSingleViewWithChildren,
} from 'vue-router'

export type AvRoute =
  | (Omit<RouteRecordSingleView, 'name'> & { name: string })
  | (Omit<RouteRecordSingleViewWithChildren, 'name'> & { name: string })
  | (Omit<RouteRecordMultipleViews, 'name'> & { name: string })
  | (Omit<RouteRecordMultipleViewsWithChildren, 'name'> & { name: string })

export interface BreadcrumbLinkRaw {
  to?: RouteLocationRaw | ((route: RouteLocationNormalizedLoaded) => RouteLocationRaw)
  textKey: string
}

export type MetaBreadcrumb = BreadcrumbLinkRaw | BreadcrumbLinkRaw[]

// Enables typed `meta.breadcrumb` on route records so breadcrumbs can be declared where routes are defined.
// `meta.cguRouteName` is declared on each universe layout record: Vue Router merges meta along the whole
// matched chain, so every child inherits it and the global cgu guard applies to all navigations inside the universe.
declare module 'vue-router' {
  interface RouteMeta {
    breadcrumb?: MetaBreadcrumb
    cguRouteName?: string
  }
}
