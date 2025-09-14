import type { Component } from 'vue'

export type FieldRenderer = {
  component: Component
  mapProps?: (schemaField: unknown) => Record<string, unknown>
}

const registry = new Map<string, FieldRenderer>()

export function registerField(kind: string, renderer: FieldRenderer) {
  registry.set(kind, renderer)
}

export function resolveField(kind: string): FieldRenderer | undefined {
  return registry.get(kind)
}

export function getFieldRegistry() {
  return registry
}
