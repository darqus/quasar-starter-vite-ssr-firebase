import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type Unsubscribe,
  type User,
  type UserCredential,
} from 'firebase/auth'

import { auth } from '@/lib/firebase/client'

/**
 * Thin Firebase Auth wrappers.
 *
 * No mapping, no UI and no routing here: this module only exposes the
 * provider calls so the model layer can decide what to do with the result.
 */
export const signIn = (
  email: string,
  password: string
): Promise<UserCredential> => signInWithEmailAndPassword(auth, email, password)

export const signUp = (
  email: string,
  password: string
): Promise<UserCredential> =>
  createUserWithEmailAndPassword(auth, email, password)

export const sendReset = (email: string): Promise<void> =>
  sendPasswordResetEmail(auth, email)

export const signOutUser = (): Promise<void> => signOut(auth)

/** Subscribes to the Firebase session and returns the unsubscribe function. */
export const observeAuthState = (
  callback: (user: User | null) => void
): Unsubscribe => onAuthStateChanged(auth, callback)
