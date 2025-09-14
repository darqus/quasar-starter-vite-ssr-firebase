import { type FirebaseApp, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore'

// init firebase app
const firebaseApp: FirebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
})

// init services
const db = getFirestore()

export const auth = getAuth(firebaseApp)

// get collection data
export const getCollection = (collectionName: string) =>
  getDocs(collection(db, collectionName))

// set doc https://firebase.google.com/docs/firestore/query-data/queries?authuser=0&hl=en
export const addDoc = (collectionName: string, data: unknown) =>
  setDoc(doc(collection(db, collectionName)), data)
