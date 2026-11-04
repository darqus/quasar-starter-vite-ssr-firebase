import { describe, expect, it, vi } from 'vitest'
import type { RouteLocationNormalized } from 'vue-router'

import { createAuthGuard, type AuthSession } from '@/router/guards'
import { ROUTE_NAME } from '@/types/route'

const makeTo = (
  meta: RouteLocationNormalized['meta'],
  fullPath = '/account'
): RouteLocationNormalized => ({ meta, fullPath }) as RouteLocationNormalized

const makeSession = (isAuthenticated: boolean): AuthSession => ({
  isAuthenticated,
  waitUntilReady: vi.fn(() => Promise.resolve()),
})

describe('createAuthGuard', () => {
  it('redirects anonymous users away from protected routes', async () => {
    const guard = createAuthGuard(() => makeSession(false))

    const result = await guard(
      makeTo({ title: 'Профиль', requiresAuth: true }),
      makeTo({ title: 'Home' }, '/'),
      () => {}
    )

    expect(result).toEqual({
      name: ROUTE_NAME.LOGIN,
      query: { redirect: '/account' },
    })
  })

  it('allows authenticated users into protected routes', async () => {
    const guard = createAuthGuard(() => makeSession(true))

    const result = await guard(
      makeTo({ title: 'Профиль', requiresAuth: true }),
      makeTo({ title: 'Home' }, '/'),
      () => {}
    )

    expect(result).toBe(true)
  })

  it('redirects authenticated users away from public-only routes', async () => {
    const guard = createAuthGuard(() => makeSession(true))

    const result = await guard(
      makeTo({ title: 'Войти', publicOnly: true }, '/login'),
      makeTo({ title: 'Home' }, '/'),
      () => {}
    )

    expect(result).toEqual({ name: ROUTE_NAME.ACCOUNT })
  })

  it('allows anonymous users into public-only routes', async () => {
    const guard = createAuthGuard(() => makeSession(false))

    const result = await guard(
      makeTo({ title: 'Войти', publicOnly: true }, '/login'),
      makeTo({ title: 'Home' }, '/'),
      () => {}
    )

    expect(result).toBe(true)
  })

  it('does not wait for the session on routes without access rules', async () => {
    const session = makeSession(false)
    const guard = createAuthGuard(() => session)

    const result = await guard(
      makeTo({ title: 'Ошибка' }, '/missing'),
      makeTo({ title: 'Home' }, '/'),
      () => {}
    )

    expect(result).toBe(true)
    expect(session.waitUntilReady).not.toHaveBeenCalled()
  })

  it('awaits session restoration before deciding', async () => {
    const session = makeSession(false)
    const guard = createAuthGuard(() => session)

    await guard(
      makeTo({ title: 'Профиль', requiresAuth: true }),
      makeTo({ title: 'Home' }, '/'),
      () => {}
    )

    expect(session.waitUntilReady).toHaveBeenCalledTimes(1)
  })
})
