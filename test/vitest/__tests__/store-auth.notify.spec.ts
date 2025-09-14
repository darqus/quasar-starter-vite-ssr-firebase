import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

import { createPinia, setActivePinia } from 'pinia'

import { Notify } from 'quasar'

import { useStoreAuth } from 'src/stores/store-auth'
import { ROUTE_TYPE } from 'src/types/route'

describe('store-auth notify behavior', () => {
  it('onRegisterSuccess pushes to account and shows success notify', async () => {
    setActivePinia(createPinia())

    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: `/${ROUTE_TYPE.ACCOUNT}`, component: { template: '<div>ok</div>' } },
      ],
    })

    // Notify plugin is globally registered in test setup; just spy on it

    const store = useStoreAuth()
    const pushSpy = vi.spyOn(router, 'push').mockResolvedValue(undefined as unknown as never)

    // Ensure Notify.create exists and is spy-able in this runtime
    if (!(Notify as unknown as { create?: unknown }).create) {
      // @ts-expect-error augment at runtime for test
      Notify.create = () => {}
    }
    const notifySpy = vi.spyOn(Notify, 'create')

    store.onRegisterSuccess('uid', 'user@example.com', router)

    // wait for router push promise chain to flush
    await Promise.resolve()
    await Promise.resolve()

    expect(pushSpy).toHaveBeenCalledWith({ path: ROUTE_TYPE.ACCOUNT })
    expect(notifySpy).toHaveBeenCalled()
  })
})
