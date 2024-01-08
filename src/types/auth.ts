import type { User, } from 'firebase/auth'

import type { AUTH_TYPE, } from './enums'
import type { Form, Loading, Valid, } from './models'

export type CurrentUser = User | null

export type TAuthState = {
  formsAuth: Record<AUTH_TYPE, Form>
  currentUser: CurrentUser
  loggedIn: boolean
  isCheckedPolicy: boolean
  passwordVisibility: boolean
} & Loading & Valid

type TRouteLink = {
  title: string,
  icon: string,
  path: string,
  visible: boolean
}

export type TAuthLinks = TRouteLink[]
