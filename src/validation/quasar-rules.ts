import type { ZodTypeAny } from 'zod'

// Generate basic Quasar per-field rules from a Zod schema's shape
export function rulesFromZodField(schema: ZodTypeAny) {
  // lightweight: run safeParse on single value and return first message
  return [
    (v: unknown) => {
      const res = schema.safeParse(v)
      if (res.success) return true
      const issue = res.error.issues[0]
      return issue?.message ?? 'Некорректное значение'
    },
  ]
}

// Parse whole object and return map field->message[] for UI mapping
export function parseAndCollectErrors<T extends Record<string, unknown>>(
  schema: ZodTypeAny,
  data: T
): { ok: true; data: T } | { ok: false; errors: Record<string, string[]> } {
  const res = schema.safeParse(data)
  if (res.success) return { ok: true, data: res.data as T }
  const map: Record<string, string[]> = {}
  for (const issue of res.error.issues) {
    const path = issue.path.join('.')
    map[path] ??= []
    map[path].push(issue.message)
  }
  return { ok: false, errors: map }
}
