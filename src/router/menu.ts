import type { RouteRecordRaw } from 'vue-router'

import type { MenuVisibility } from '@/types/route'

export type RouteMenuLink = {
  name: string
  title: string
  icon: string
  visibility: MenuVisibility
}

/**
 * Builds the sidebar menu from the route table so routing stays the single
 * source of truth for paths, labels, icons and access rules.
 */
export const buildRouteMenu = (
  routes: readonly RouteRecordRaw[]
): RouteMenuLink[] =>
  routes
    .filter(
      (route) => route.meta?.menu === true && typeof route.name === 'string'
    )
    .map((route) => ({
      name: route.name as string,
      title: route.meta?.title ?? '',
      icon: route.meta?.icon ?? '',
      visibility: route.meta?.menuVisibility ?? 'always',
    }))

export const isMenuLinkVisible = (
  link: RouteMenuLink,
  isAuthenticated: boolean
): boolean => {
  switch (link.visibility) {
    case 'authenticated':
      return isAuthenticated
    case 'anonymous':
      return !isAuthenticated
    default:
      return true
  }
}
