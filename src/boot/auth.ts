import { boot, } from 'quasar/wrappers'

import { useStoreAuth, } from '@/stores/store-auth'

export default boot(({ store, }) => { useStoreAuth(store).watchAuthStateChanged() })
