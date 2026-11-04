import { type RouteRecordRaw } from 'vue-router'

import { buildRouteMenu, type RouteMenuLink } from '@/router/menu'
import { ROUTE_NAME, ROUTE_PATH } from '@/types/route'

const routesChildren: RouteRecordRaw[] = [
  {
    path: '',
    name: ROUTE_NAME.HOME,
    component: async () => await import('@/pages/home/HomePage.vue'),
    meta: {
      title: 'Главная',
      icon: 'home',
      menu: true,
      menuVisibility: 'authenticated',
    },
  },
  {
    path: ROUTE_PATH.REGISTER,
    name: ROUTE_NAME.REGISTER,
    component: async () => await import('@/pages/auth/RegisterPage.vue'),
    meta: {
      title: 'Регистрация',
      icon: 'person_add',
      menu: true,
      menuVisibility: 'anonymous',
      publicOnly: true,
    },
  },
  {
    path: ROUTE_PATH.LOGIN,
    name: ROUTE_NAME.LOGIN,
    component: async () => await import('@/pages/auth/LoginPage.vue'),
    meta: {
      title: 'Войти',
      icon: 'login',
      menu: true,
      menuVisibility: 'anonymous',
      publicOnly: true,
    },
  },
  {
    path: ROUTE_PATH.FORGOT,
    name: ROUTE_NAME.FORGOT,
    component: async () => await import('@/pages/auth/ForgotPage.vue'),
    meta: {
      title: 'Забыли пароль?',
      icon: 'lock_reset',
      menu: true,
      menuVisibility: 'anonymous',
      publicOnly: true,
    },
  },
  {
    path: ROUTE_PATH.ACCOUNT,
    name: ROUTE_NAME.ACCOUNT,
    component: async () => await import('@/pages/account/AccountPage.vue'),
    meta: {
      title: 'Профиль',
      icon: 'account_circle',
      menu: true,
      menuVisibility: 'authenticated',
      requiresAuth: true,
    },
  },
  {
    path: ROUTE_PATH.NEW_EMPLOYEE,
    name: ROUTE_NAME.NEW_EMPLOYEE,
    component: async () => await import('@/pages/employee/NewEmployeePage.vue'),
    meta: {
      title: 'Новый сотрудник',
      icon: 'badge',
      menu: true,
      menuVisibility: 'authenticated',
      requiresAuth: true,
    },
  },
]

const routes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATH.HOME,
    component: async () => await import('@/layouts/MainLayout.vue'),
    children: routesChildren,
  },
  {
    path: '/:catchAll(.*)*',
    component: async () => await import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: ROUTE_NAME.NOT_FOUND,
        component: async () => await import('@/pages/error/ErrorNotFound.vue'),
        meta: {
          title: 'Ошибка',
        },
      },
    ],
  },
]

export const ROUTE_MENU: RouteMenuLink[] = buildRouteMenu(routesChildren)

export default routes
