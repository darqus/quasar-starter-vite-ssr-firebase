import { LocalStorage, useQuasar } from 'quasar'

import { useStoreAuth } from '@/stores/store-auth'
import { StorageKey } from '@/types/storage'

import { defineBoot } from '#q-app'

export default defineBoot(({ store, app }) => {
  useStoreAuth(store).watchAuthStateChanged()

  // Initialize theme from LocalStorage (fallback to env)
  const $q = app.config.globalProperties.$q || useQuasar()
  const saved = LocalStorage.getItem(StorageKey.ThemeDark)
  const fallback = Boolean(import.meta.env.VITE_DARK)
  const isDark = typeof saved === 'boolean' ? saved : fallback
  $q.dark.set(isDark)
})
