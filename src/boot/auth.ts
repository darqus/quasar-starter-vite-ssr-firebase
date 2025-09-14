import { boot } from 'quasar/wrappers'

import { useStoreAuth } from 'src/stores/store-auth'

export default boot(({ store }) => {
  useStoreAuth(store).watchAuthStateChanged()
})
