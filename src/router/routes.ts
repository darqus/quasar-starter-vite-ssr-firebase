import { type RouteRecordRaw } from 'vue-router'

import { ROUTE_TYPE } from 'src/types/route'

const { VITE_ROUTER_BASE: BASE } = import.meta.env

const { REGISTER, LOGIN, FORGOT, ACCOUNT, NEW_EMPLOYEE } = ROUTE_TYPE

const routes: RouteRecordRaw[] = [
  {
    path: BASE,
    component: async () => await import('layouts/MainLayout.vue'),
    children: [
      {
        path: BASE,
        component: async () => await import('pages/home/HomePage.vue'),
      },
      {
        path: REGISTER,
        component: async () => await import('pages/auth/RegisterPage.vue'),
      },
      {
        path: LOGIN,
        component: async () => await import('pages/auth/LoginPage.vue'),
      },
      {
        path: FORGOT,
        component: async () => await import('pages/auth/ForgotPage.vue'),
      },
      {
        path: ACCOUNT,
        component: async () => await import('pages/account/AccountPage.vue'),
      },
      {
        path: NEW_EMPLOYEE,
        component: async () =>
          await import('pages/employee/NewEmployeePage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: async () => await import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: async () => await import('pages/error/ErrorNotFound.vue'),
      },
    ],
  },
]

export default routes
