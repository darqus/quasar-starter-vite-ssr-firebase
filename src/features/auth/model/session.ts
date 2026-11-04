import { computed, ref } from 'vue'

import type { Unsubscribe, User } from 'firebase/auth'

import { defineStore } from 'pinia'

import { STORE_TYPES } from '@/types/store'

import { observeAuthState } from '../api/authApi'

export type AuthStatus = 'unknown' | 'authenticated' | 'anonymous'

/**
 * Session-only auth store.
 *
 * It knows nothing about routing, notifications or loading overlays: those
 * belong to page-level composables and the router guard. Keeping the store
 * free of UI code lets it be reused outside components.
 */
export const useStoreAuth = defineStore(STORE_TYPES.AUTH, () => {
  const currentUser = ref<User | null>(null)
  const status = ref<AuthStatus>('unknown')

  const isAuthenticated = computed(() => status.value === 'authenticated')
  // Backwards-compatible alias for templates and guards.
  const loggedIn = isAuthenticated

  let unsubscribe: Unsubscribe | null = null
  let resolveSessionReady: (() => void) | null = null
  const sessionReady = new Promise<void>((resolve) => {
    resolveSessionReady = resolve
  })

  const markSessionReady = () => {
    if (resolveSessionReady) {
      resolveSessionReady()
      resolveSessionReady = null
    }
  }

  /**
   * Subscribes to Firebase Auth once. The returned promise resolves after the
   * first auth state is known, so route guards never see a false anonymous state.
   */
  const watchAuthStateChanged = (): Promise<void> => {
    if (unsubscribe) {
      return sessionReady
    }

    unsubscribe = observeAuthState((user) => {
      currentUser.value = user
      status.value = user ? 'authenticated' : 'anonymous'
      markSessionReady()
    })

    return sessionReady
  }

  const waitUntilReady = async (): Promise<void> => {
    await watchAuthStateChanged()
  }

  return {
    currentUser,
    status,
    isAuthenticated,
    loggedIn,
    watchAuthStateChanged,
    waitUntilReady,
  }
})
