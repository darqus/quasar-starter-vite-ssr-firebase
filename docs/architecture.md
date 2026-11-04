# Структура проекта и границы импортов

Статус: **актуально** (фаза 4, см. `plan/architecture-improvements.md`).

## Слои

```
pages / layouts
      ↓
features/<name>            ← публичный API: features/<name>/index.ts
      ↓
shared/form, shared/ui     ← Vue/Quasar разрешены
      ↓
shared/lib                 ← только чистый TypeScript
      ↓
lib (Firebase init), types
```

Направление зависимостей — только вниз. Страница не импортирует другую
страницу, фича не лезет во внутренности другой фичи, `shared/lib` не знает
про Vue, Quasar и доменные фичи.

## Где что лежит

| Путь                              | Что там                                                                                                   |
| --------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `src/pages/<name>/<Name>Page.vue` | маршрутные страницы; UI-сценарии страницы                                                                 |
| `src/layouts/`                    | layout и компоненты оболочки (`components/`)                                                              |
| `src/features/auth/`              | `api/` (Firebase Auth), `model/` (состояние, формы, типы), `actions/` (сценарии с навигацией), `index.ts` |
| `src/features/employees/`         | `api/` (Firestore), `model/` (стор, фильтры, формы, типы), `ui/` (карточки), `index.ts`                   |
| `src/shared/form/`                | `useForm`, `FormFields`, поля, `EssentialForm`, типы полей, доступ к значениям                            |
| `src/shared/ui/`                  | общий UI-фидбек (`createFeedback`)                                                                        |
| `src/shared/lib/`                 | чистые утилиты: `errors`, `date`, `theme`, `meta`, `generator`, `constants`                               |
| `src/lib/firebase/client.ts`      | инициализация Firebase; `auth` — сразу, Firestore — лениво через `getDb()`                                |
| `src/types/`                      | общеприкладные типы: маршруты, storage keys, store ids                                                    |
| `src/validation/`                 | zod-схемы, правила Quasar, сбор ошибок                                                                    |

Стор домена живёт в `features/<name>/model`, а не в `src/stores/`.
`src/stores/index.ts` — только настройка Pinia.

## Публичный API фичи

Снаружи фичи импорт только через её `index.ts`:

```ts
// правильно
import { useAuthActions, useStoreAuth } from '@/features/auth'
// неправильно: глубокий импорт внутренностей
import { useAuthActions } from '@/features/auth/actions/useAuthActions'
import { UserCardList, filterEmployees } from '@/features/employees'
```

Внутри фичи используйте относительные пути (`./filters`, `../api/...`).

## Проверка

```bash
npm run check:boundaries   # отдельно
npm run lint               # входит в общую проверку
```

Скрипт `scripts/check-import-boundaries.mjs` читает `src/**/*.{ts,vue}`,
извлекает статические, реэкспортные и динамические импорты и падает с
`file:line` при нарушении. Чистая логика — `scripts/lib/importBoundaries.mjs`,
тесты — `scripts/lib/importBoundaries.test.mjs`.

Основные правила:

- `shared/lib` не импортирует `vue`, `quasar`, `vue-router`, `pinia`,
  `firebase`, `@/features`, `@/shared/form`, `@/shared/ui`, `@/stores`,
  `@/pages`, `@/layouts`, `@/router`, `@/lib`, `@/boot`;
- `features/<name>/api` не импортирует `vue`, `quasar`, `vue-router`, `pinia`;
- `features/<name>/model` не импортирует `quasar`, `vue-router`;
- `features/<name>/actions` может использовать `vue-router` (навигация), но не
  Quasar;
- `stores` не импортируют Quasar, Router, страницы и layout;
- страницы не импортируют другие страницы;
- `lib` не импортирует `shared`, фичи, сторы, страницы и router;
- глубокий импорт `@/features/<other>/...` запрещён — только `@/features/<other>`.

## Почему так

- Доменный код и API не должны зависеть от UI-фреймворка: это позволяет
  тестировать их без Quasar и менять UI без переписывания данных.
- Публичный `index.ts` фичи фиксирует контракт: внутренняя перестановка файлов
  не ломает страницы.
- `shared/lib` без Vue/Quasar можно переиспользовать в любом контексте.
- Ленивый Firestore убирает ~570 KB из начальной загрузки: данные сотрудников
  грузятся только когда они реально нужны.
