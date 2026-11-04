import { describe, expect, it } from 'vitest'
import type { RouteRecordRaw } from 'vue-router'

import { buildRouteMenu, isMenuLinkVisible } from '@/router/menu'
import { ROUTE_NAME } from '@/types/route'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: ROUTE_NAME.HOME,
    component: { template: '<div />' },
    meta: {
      title: 'Главная',
      icon: 'home',
      menu: true,
      menuVisibility: 'authenticated',
    },
  },
  {
    path: '/login',
    name: ROUTE_NAME.LOGIN,
    component: { template: '<div />' },
    meta: {
      title: 'Войти',
      icon: 'login',
      menu: true,
      menuVisibility: 'anonymous',
    },
  },
  {
    path: '/hidden',
    name: 'hidden',
    component: { template: '<div />' },
    meta: { title: 'Скрытая' },
  },
]

describe('buildRouteMenu', () => {
  it('takes menu entries from route meta', () => {
    expect(buildRouteMenu(routes)).toEqual([
      {
        name: ROUTE_NAME.HOME,
        title: 'Главная',
        icon: 'home',
        visibility: 'authenticated',
      },
      {
        name: ROUTE_NAME.LOGIN,
        title: 'Войти',
        icon: 'login',
        visibility: 'anonymous',
      },
    ])
  })
})

describe('isMenuLinkVisible', () => {
  const link = {
    name: ROUTE_NAME.HOME,
    title: 'Главная',
    icon: 'home',
    visibility: 'authenticated' as const,
  }

  it('filters by authentication state', () => {
    expect(isMenuLinkVisible(link, true)).toBe(true)
    expect(isMenuLinkVisible(link, false)).toBe(false)
    expect(isMenuLinkVisible({ ...link, visibility: 'anonymous' }, false)).toBe(
      true
    )
    expect(isMenuLinkVisible({ ...link, visibility: 'always' }, false)).toBe(
      true
    )
  })
})
