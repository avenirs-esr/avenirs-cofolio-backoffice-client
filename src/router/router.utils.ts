import type { RouterScrollBehavior } from 'vue-router'

export const scrollBehavior: RouterScrollBehavior = (to, _from, savedPosition) => {
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

export function getPageTitle (title?: string | null): string {
  const specificTitle = title ? `${title} - ` : ''
  return `${specificTitle}CofolioBackOffice`
}
