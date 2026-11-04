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
- Проверьте импорты и сортировку (`oxfmt`, `sortImports`).

## Итоги миграции в проекте

- Сторы принадлежат своим фичам: `src/features/auth/model/session.ts` и
  `src/features/employees/model/store.ts`.
- `src/stores/index.ts` содержит только настройку Pinia; стор кладётся в
  `features/<name>/model`, если он относится к домену.
- Legacy `store-auth`, `store-employee-cards` в `src/stores/` и
  `example-store.ts` удалены (фазы 2 и 4).

Если нужно, можно дополнить сторы типами возвращаемого API и добавить unit-тесты для действий/геттеров.
