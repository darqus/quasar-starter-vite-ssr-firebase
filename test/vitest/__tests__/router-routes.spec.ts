import { describe, expect, it } from 'vitest'
import type { RouteRecordRaw } from 'vue-router'

import routes, { ROUTE_MENU } from '@/router/routes'
import { ROUTE_NAME } from '@/types/route'

const layoutRoute = routes[0] as RouteRecordRaw
const pageRoutes = layoutRoute.children ?? []

const findRoute = (name: ROUTE_NAME) =>
  pageRoutes.find((route) => route.name === name)

describe('route table', () => {
  it('gives every page route a name and a title', () => {
    expect(pageRoutes).toHaveLength(6)

    for (const route of pageRoutes) {
      expect(typeof route.name).toBe('string')
      expect(route.meta?.title).toBeTruthy()
    }
  })

  it('marks protected routes as requiring auth', () => {
    expect(findRoute(ROUTE_NAME.ACCOUNT)?.meta?.requiresAuth).toBe(true)
    expect(findRoute(ROUTE_NAME.NEW_EMPLOYEE)?.meta?.requiresAuth).toBe(true)
    expect(findRoute(ROUTE_NAME.HOME)?.meta?.requiresAuth).toBeUndefined()
  })

  it('marks auth routes as public-only', () => {
    expect(findRoute(ROUTE_NAME.LOGIN)?.meta?.publicOnly).toBe(true)
    expect(findRoute(ROUTE_NAME.REGISTER)?.meta?.publicOnly).toBe(true)
    expect(findRoute(ROUTE_NAME.FORGOT)?.meta?.publicOnly).toBe(true)
  })

  it('builds the sidebar menu from the route table', () => {
    expect(ROUTE_MENU.map(({ name }) => name)).toEqual([
      ROUTE_NAME.HOME,
      ROUTE_NAME.REGISTER,
      ROUTE_NAME.LOGIN,
      ROUTE_NAME.FORGOT,
      ROUTE_NAME.ACCOUNT,
      ROUTE_NAME.NEW_EMPLOYEE,
    ])
  })
})
