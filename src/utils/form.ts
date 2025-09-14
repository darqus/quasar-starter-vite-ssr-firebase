import { isRef, type Ref } from 'vue'

import type { Fields } from 'src/types/form'

// Get underlying array from Ref or plain array
function unwrapFields(fields: Ref<Fields> | Fields): Fields {
  return (isRef(fields) ? fields.value : fields)
}

// Returns raw model value by field name (could be string | number | null)
export function getFieldModel(fields: Ref<Fields> | Fields, name: string) {
  const list = unwrapFields(fields)
  const field = list.find(f => f.name === name)
  return field?.model ?? null
}

// Returns model string with safe fallback (default: empty string)
export function getFieldString(
  fields: Ref<Fields> | Fields,
  name: string,
  fallback = ''
): string {
  const val = getFieldModel(fields, name)
  if (val == null) return fallback

  switch (typeof val) {
    case 'string':
      return val
    case 'number':
    case 'boolean':
    case 'bigint':
      return String(val)
    case 'symbol':
      return val.description ?? fallback
    case 'object':
      try {
        const json = JSON.stringify(val)
        return json ?? fallback
      } catch {
        return fallback
      }
    default:
      return fallback
  }
}

// Convert fields to a name -> value map
export function toFormDataMap(fields: Ref<Fields> | Fields): Record<string, unknown> {
  const list = unwrapFields(fields)
  return list.reduce((acc, f) => {
    const name = typeof f.name === 'string' ? f.name.trim() : ''
    if (!name) return acc
    acc[name] = f.model
    return acc
  }, {} as Record<string, unknown>)
}
