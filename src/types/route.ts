export enum ROUTE_NAME {
  HOME = 'home',
  REGISTER = 'register',
  LOGIN = 'login',
  FORGOT = 'forgot',
  ACCOUNT = 'account',
  NEW_EMPLOYEE = 'new-employee',
  NOT_FOUND = 'not-found',
}

export enum ROUTE_PATH {
  HOME = '/',
  REGISTER = '/register',
  LOGIN = '/login',
  FORGOT = '/forgot',
  ACCOUNT = '/account',
  NEW_EMPLOYEE = '/new-employee',
}

export type MenuVisibility = 'always' | 'authenticated' | 'anonymous'

export type AppRouteMeta = {
  title: string
  icon?: string
  menu?: boolean
  menuVisibility?: MenuVisibility
  requiresAuth?: boolean
  publicOnly?: boolean
}

declare module 'vue-router' {
  // oxlint-disable-next-line typescript/consistent-type-definitions -- module augmentation requires an interface
  export interface RouteMeta extends AppRouteMeta {}
}
