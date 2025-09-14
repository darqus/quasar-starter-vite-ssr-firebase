# Миграция стора на Composition API

В проекте стора переписаны на современный стиль `defineStore(..., () => { ... })` (Composition API). Это сохраняет публичный контракт и упрощает типизацию, повторное использование и тестирование.

## Почему так лучше

- Чёткое разделение реактивного состояния (`ref`, `computed`) и действий (обычные функции).
- Простая типизация возвращаемого API: всё, что возвращено из `setup`, — публично.
- Лёгкая переиспользуемость логики и unit-тестирование.

## Базовый шаблон

```ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useExampleStore = defineStore('example', () => {
  // state
  const counter = ref(0)

  // getters
  const doubleCount = computed(() => counter.value * 2)

  // actions
  function increment() {
    counter.value += 1
  }

  return { counter, doubleCount, increment }
})
```

## Чек-лист миграции

- Оставьте прежний `id` стора (первый аргумент `defineStore`) — это сохранит совместимость.
- Преобразуйте `state` → `ref(...)`, `getters` → `computed(...)`.
- Методы из `actions` сделайте обычными функциями. Не используйте `this` — обращайтесь к `ref` напрямую.
- Верните из `setup` только то, что должно быть публичным.
- Проверьте импорты и сортировку (`eslint-plugin-import`).

## Итоги миграции в проекте

- `src/stores/store-auth.ts` — переписан на Composition API, публичный контракт сохранён.
- `src/stores/store-employee-cards.ts` — переписан, вычисляемые поля и действия разделены.
- `src/stores/example-store.ts` — пример минимального стора на Composition API.

Если нужно, можно дополнить сторы типами возвращаемого API и добавить unit-тесты для действий/геттеров.
