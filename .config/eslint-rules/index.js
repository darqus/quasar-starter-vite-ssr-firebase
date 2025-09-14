// Vue ESLint rules configuration
import { common } from './modules/common.js'
import { ts } from './modules/ts.js'
import { vueAttributes } from './modules/vue-attributes.js'
import { vue } from './modules/vue.js'

export const rules = {
  ...common,
  ...ts,
  ...vue,
  ...vueAttributes,
}
