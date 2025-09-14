import { config } from '@vue/test-utils'


import { Loading, Notify, Quasar } from 'quasar'

// Basic Vue Test Utils config; add plugins/mocks as needed
config.global.plugins = [[Quasar, { plugins: { Notify, Loading } }]]
