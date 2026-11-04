import type { User } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createPinia, setActivePinia } from 'pinia'

const authApiMocks = vi.hoisted(() => ({
  observeAuthState: vi.fn(),
}))
vi.mock('@/features/auth/api/authApi', () => authApiMocks)

import { useStoreAuth } from '@/features/auth'

type AuthCallback = (user: User | null) => void

const createUser = (email: string): User =>
  ({ uid: 'uid-1', email }) as unknown as User

describe('auth session store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    authApiMocks.observeAuthState.mockReset()
  })

  it('stays unknown until Firebase reports the first state', async () => {
    let callback: AuthCallback | undefined
    authApiMocks.observeAuthState.mockImplementation((cb: AuthCallback) => {
      callback = cb
      return vi.fn()
    })

    const store = useStoreAuth()
    expect(store.status).toBe('unknown')
    expect(store.isAuthenticated).toBe(false)

    const ready = store.watchAuthStateChanged()
    expect(authApiMocks.observeAuthState).toHaveBeenCalledTimes(1)

    callback?.(createUser('user@example.com'))
    await ready

    expect(store.currentUser?.email).toBe('user@example.com')
    expect(store.status).toBe('authenticated')
    expect(store.isAuthenticated).toBe(true)
    expect(store.loggedIn).toBe(true)
  })

  it('reports an anonymous session after sign out', async () => {
    let callback: AuthCallback | undefined
    authApiMocks.observeAuthState.mockImplementation((cb: AuthCallback) => {
      callback = cb
      return vi.fn()
    })

    const store = useStoreAuth()
    const ready = store.waitUntilReady()

    callback?.(null)
    await ready

    expect(store.currentUser).toBeNull()
    expect(store.status).toBe('anonymous')
    expect(store.isAuthenticated).toBe(false)
  })

  it('subscribes to Firebase Auth only once', async () => {
    let callback: AuthCallback | undefined
    authApiMocks.observeAuthState.mockImplementation((cb: AuthCallback) => {
      callback = cb
      return vi.fn()
    })

    const store = useStoreAuth()
    const first = store.watchAuthStateChanged()
    const second = store.watchAuthStateChanged()

    expect(authApiMocks.observeAuthState).toHaveBeenCalledTimes(1)

    callback?.(null)
    await Promise.all([first, second])
  })
})
