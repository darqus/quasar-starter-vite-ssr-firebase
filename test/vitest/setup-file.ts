import { config } from '@vue/test-utils'

import { vi } from 'vitest'

import { Loading, Notify, Quasar } from 'quasar'

// Tests must not depend on `.env.local`: the real client initializes Firebase
// from Vite env variables at import time.
vi.mock('@/lib/firebase/client', () => ({
  auth: {},
  getDb: async () => ({}),
}))

// Basic Vue Test Utils config; add plugins/mocks as needed
config.global.plugins = [[Quasar, { plugins: { Notify, Loading } }]]
