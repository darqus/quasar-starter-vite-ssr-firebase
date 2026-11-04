import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'

import { useStoreAuth } from '@/features/auth'

import { defineRouter } from '#q-app'

import { createAuthGuard } from './guards'
import routes from './routes'

/*
 * SPA-only by design, see docs/adr/0001-spa-first.md.
 * The router is the single source of truth for access rules.
 */
export default defineRouter(({ store }) => {
  const createHistory =
    import.meta.env.VITE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.VITE_ROUTER_BASE),
  })

  Router.beforeEach(createAuthGuard(() => useStoreAuth(store)))

  return Router
})
