import type { Loading, Valid } from './models'

import type { User } from 'firebase/auth'

export type CurrentUser = User | null

export type TAuthState = {
  currentUser: CurrentUser
  loggedIn: boolean
  isCheckedPolicy: boolean
  passwordVisibility: boolean
} & Loading &
  Valid

type TRouteLink = {
  title: string
  icon: string
  path: string
  visible: boolean
}

export type TAuthLinks = TRouteLink[]
