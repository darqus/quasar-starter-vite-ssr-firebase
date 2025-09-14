import { boot } from 'quasar/wrappers'

import FormDatePicker from 'src/components/form-fields/components/FormDatePicker.vue'
import FormInput from 'src/components/form-fields/components/FormInput.vue'
import FormSelect from 'src/components/form-fields/components/FormSelect.vue'
import FormTextArea from 'src/components/form-fields/components/FormTextArea.vue'
import { getFieldRegistry } from 'src/components/form-fields/registry'

export default boot(() => {
  const registry = getFieldRegistry()
  if (!registry.has('input')) registry.set('input', { component: FormInput })
  if (!registry.has('select')) registry.set('select', { component: FormSelect })
  if (!registry.has('textarea'))
    registry.set('textarea', { component: FormTextArea })
  if (!registry.has('date')) registry.set('date', { component: FormDatePicker })
})
