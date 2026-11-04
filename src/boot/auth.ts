import { LocalStorage, useQuasar } from 'quasar'

import { useStoreAuth } from '@/features/auth'
import { resolveInitialDark } from '@/shared/lib/theme'
import { StorageKey } from '@/types/storage'

import { defineBoot } from '#q-app'

export default defineBoot(({ store, app }) => {
  const storeAuth = useStoreAuth(store)
  void storeAuth.watchAuthStateChanged()

  const $q = app.config.globalProperties.$q || useQuasar()
  const saved = LocalStorage.getItem(StorageKey.ThemeDark)
  const isDark = resolveInitialDark(
    typeof saved === 'boolean' ? saved : null,
    import.meta.env.VITE_DARK
  )
  $q.dark.set(isDark)
})
