import { type FirebaseApp, initializeApp } from 'firebase/app'
import { type Auth, getAuth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'

const firebaseApp: FirebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: String(import.meta.env.VITE_MESSAGING_SENDER_ID),
  appId: import.meta.env.VITE_APP_ID,
})

export const auth: Auth = getAuth(firebaseApp)

let firestorePromise: Promise<Firestore> | undefined

/**
 * Firestore is only needed by data features, so the SDK is loaded on demand
 * instead of being part of the initial app shell.
 */
export const getDb = (): Promise<Firestore> => {
  firestorePromise ??= import('firebase/firestore').then(({ getFirestore }) =>
    getFirestore(firebaseApp)
  )

  return firestorePromise
}
