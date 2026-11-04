import type { NavigationGuard } from 'vue-router'

import { ROUTE_NAME } from '@/types/route'

export type AuthSession = {
  isAuthenticated: boolean
  waitUntilReady: () => Promise<void>
}

/**
 * Access control lives in the router, not in the sidebar menu.
 * The guard awaits Firebase session restoration before deciding.
 */
export const createAuthGuard = (
  getSession: () => AuthSession
): NavigationGuard => {
  return async (to) => {
    const { requiresAuth, publicOnly } = to.meta

    if (!requiresAuth && !publicOnly) {
      return true
    }

    const session = getSession()
    await session.waitUntilReady()

    if (requiresAuth && !session.isAuthenticated) {
      return {
        name: ROUTE_NAME.LOGIN,
        query: { redirect: to.fullPath },
      }
    }

    if (publicOnly && session.isAuthenticated) {
      return { name: ROUTE_NAME.ACCOUNT }
    }

    return true
  }
}
