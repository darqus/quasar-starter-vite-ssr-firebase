import { defineBoot } from '#q-app'

// Import-time initialization, kept in a boot file so Firebase is ready before
// the router guard and the auth session store start working.
// oxlint-disable-next-line import/no-unassigned-import -- initialization is the side effect
import '@/lib/firebase/client'

export default defineBoot(() => {
  // The client module performs the actual initialization.
})
