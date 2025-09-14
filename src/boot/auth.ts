import { boot } from 'quasar/wrappers'

import { LocalStorage, useQuasar } from 'quasar'

import { useStoreAuth } from 'src/stores/store-auth'
import { StorageKey } from 'src/types/storage'

export default boot(({ store, app }) => {
  useStoreAuth(store).watchAuthStateChanged()

  // Initialize theme from LocalStorage (fallback to env)
  const $q = app.config.globalProperties.$q || useQuasar()
  const saved = LocalStorage.getItem(StorageKey.ThemeDark)
  const fallback = Boolean(import.meta.env.VITE_DARK)
  const isDark = typeof saved === 'boolean' ? saved : fallback
  $q.dark.set(isDark)
})
