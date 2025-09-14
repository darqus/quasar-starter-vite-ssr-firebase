<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import { resolveField } from 'src/components/form-fields/registry'
import type { FieldAny, FormSchema } from 'src/types/form.schema'

const props = defineProps<{
  schema: FormSchema<readonly FieldAny[]>
  modelValue?: Record<string, unknown>
}>()
const emit = defineEmits<{
  'update:modelValue': [Record<string, unknown>]
  submit: [Record<string, unknown>]
}>()

const values = ref<Record<string, unknown>>({})

onMounted(() => {
  for (const f of props.schema.fields) {
    const isSelect = f.kind === 'select'
    values.value[f.name] =
      props.modelValue?.[f.name] ?? f.defaultValue ?? (isSelect ? null : '')
  }
})

watch(
  () => props.modelValue,
  (ext) => {
    if (!ext) return
    Object.assign(values.value, ext)
  },
  { deep: true }
)

const visibleFields = computed(() =>
  props.schema.fields.filter((f) => {
    const cond =
      typeof f.visible === 'function'
        ? f.visible({ values: values.value })
        : f.visible
    return cond !== false
  })
)

const onSubmit = () => {
  emit('submit', values.value)
}
</script>

<template>
  <q-form @submit.prevent="onSubmit">
    <div class="row q-col-gutter-md">
      <component
        :is="resolveField(f.kind)?.component"
        v-for="f in visibleFields"
        :key="f.name"
        v-model="values[f.name]"
        v-bind="resolveField(f.kind)?.mapProps?.(f) ?? f"
        :class="f.col ? `col-${f.col}` : 'col-12'"
      />
    </div>

    <slot name="actions" />
  </q-form>
</template>
