import FormDatePicker from '@/components/form-fields/components/FormDatePicker.vue'
import FormInput from '@/components/form-fields/components/FormInput.vue'
import FormSelect from '@/components/form-fields/components/FormSelect.vue'
import FormTextArea from '@/components/form-fields/components/FormTextArea.vue'
import { getFieldRegistry } from '@/components/form-fields/registry'

import { defineBoot } from '#q-app'

export default defineBoot(() => {
  const registry = getFieldRegistry()
  if (!registry.has('input')) {
    registry.set('input', { component: FormInput })
  }
  if (!registry.has('select')) {
    registry.set('select', { component: FormSelect })
  }
  if (!registry.has('textarea')) {
    registry.set('textarea', { component: FormTextArea })
  }
  if (!registry.has('date')) {
    registry.set('date', { component: FormDatePicker })
  }
})
