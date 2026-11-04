# Фаза 4: структура, границы импортов, мёртвый код

Статус: **выполнено** (2026-11-04)
Дата: 2026-11-03 (обновлён 2026-11-04)
Связанный план: `plan/architecture-improvements.md` (§5, фаза 4)

## 1. Аудит текущего состояния

### 1.1 Что уже есть

- `src/features/auth/{api,model}` и `src/features/employees/{api,model}` —
  доменный код уже отделён от Quasar, но публичных `index.ts` нет;
  страницы импортируют внутренние пути (`@/features/auth/model/...`).
- `src/shared/lib/errors.ts` и `src/shared/ui/feedback.ts` — единственные
  файлы в `shared/`.
- Всё остальное лежит в «плоских» папках: `components/`, `composables/`,
  `stores/`, `types/`, `utils/`.

### 1.2 Мёртвый код (проверено поиском использований)

| Файл                                              | Кто использует                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------------- |
| `src/components/ExampleComponent.vue`             | никто                                                                     |
| `src/components/EssentialLink.vue`                | никто (только сам себя)                                                   |
| `src/stores/example-store.ts` (`useCounterStore`) | никто                                                                     |
| `src/types/api.ts` (`API`)                        | никто                                                                     |
| `src/utils/array.ts`                              | никто                                                                     |
| `src/types/models.ts` → `Todo`, `Meta`            | никто                                                                     |
| `src/types/models.ts` → `Loading`, `Valid`        | только `types/new-employee.ts` (`TNewEmployeeState`, сам не используется) |
| `src/utils/format.ts`                             | только `utils/datetime.ts` и его тест                                     |
| `src/utils/datetime.ts`                           | только `isCorrectDate` (из `validation/zod-helpers.ts`)                   |

### 1.3 Нарушения границ на момент аудита

- Страницы и layout импортируют внутренности фич:
  `@/features/auth/model/session`, `@/features/auth/model/useAuthActions`,
  `@/features/employees/api/employeeRepository`.
- `stores/store-employee-cards.ts` импортирует внутренности employees.
- `shared/form` (после переноса) будет зависеть от `@/types/route`, если
  `EssentialForm` останется с ссылкой на login. Это допустимая зависимость
  от чистых типов/констант.

### 1.4 Бандл (baseline после фазы 3)

```
dist/spa/assets/client-*.js   551 KB  ← firebase/app + firebase/auth + firebase/firestore
dist/spa/assets/index-*.js    107 KB
dist/spa/assets/schemas-*.js  146 KB
```

`client-*.js` стоит в `modulepreload` в `index.html`, потому что
`src/lib/firebase/client.ts` синхронно вызывает `getFirestore()`, а его
импортирует `boot/firebase.ts`. Firestore нужен только на странице
сотрудников.

## 2. Целевое дерево

```
src/
├── boot/                    auth.ts, firebase.ts
├── css/
├── features/
│   ├── auth/
│   │   ├── api/authApi.ts
│   │   ├── actions/useAuthActions.ts  ← навигация/сценарии
│   │   ├── model/
│   │   │   ├── authErrors.ts
│   │   │   ├── fields.ts          ← AUTH_FIELD, AuthFieldName
│   │   │   ├── formFields.ts      ← из stores/authForms.ts
│   │   │   └── session.ts
│   │   └── index.ts
│   └── employees/
│       ├── api/employeeRepository.ts
│       ├── model/
│       │   ├── fields.ts          ← EMPLOYEE_FIELD, EmployeeFieldName
│       │   ├── filters.ts
│       │   ├── formFields.ts      ← из stores/employeeForms.ts
│       │   ├── store.ts           ← из stores/store-employee-cards.ts
│       │   └── types.ts           ← TNewEmployee, LEVELS_MAP
│       ├── ui/
│       │   ├── UserCardList.vue
│       │   └── UserSkillList.vue
│       └── index.ts
├── layouts/
│   ├── MainLayout.vue
│   └── components/                ← SidebarDrawer, RouterMenuLink, ThemeToggler, UserAvatar
├── lib/firebase/client.ts
├── pages/
├── router/
├── shared/
│   ├── form/
│   │   ├── types.ts               ← из types/form.ts
│   │   ├── useForm.ts             ← из composables/useForm.ts
│   │   ├── access.ts              ← из utils/form.ts
│   │   ├── EssentialForm.vue      ← из components/form/EssentialForm.vue
│   │   ├── FormFields.vue
│   │   └── components/Form*.vue
│   ├── lib/
│   │   ├── constants.ts           ← utils/constants.ts
│   │   ├── date.ts                ← только isCorrectDate
│   │   ├── errors.ts
│   │   ├── generator.ts           ← utils/generator.ts
│   │   ├── meta.ts                ← utils/meta.ts
│   │   └── theme.ts               ← utils/theme.ts
│   └── ui/feedback.ts
├── stores/
│   ├── index.ts
│   └── store-flag.d.ts
└── types/
    ├── env.d.ts
    ├── route.ts
    ├── storage.ts
    └── store.ts
```

`types/index.ts` удалён: реэкспорт `AUTH_FIELD`/`EMPLOYEE_FIELD`/`form`
больше не нужен, импорты стали явными.

## 3. Публичные API фич

`features/auth/index.ts`:

```ts
export { useStoreAuth } from './model/session'
export { useAuthActions } from './actions/useAuthActions'
export { mapAuthError } from './model/authErrors'
export { createAuthFields } from './model/formFields'
export { AUTH_FIELD, type AuthFieldName } from './model/fields'
```

`features/employees/index.ts`:

```ts
export {
  createEmployee,
  EMPLOYEES_COLLECTION,
  listEmployees,
} from './api/employeeRepository'
export { filterEmployees } from './model/filters'
export { createNewEmployeeFields } from './model/formFields'
export { EMPLOYEE_FIELD, type EmployeeFieldName } from './model/fields'
export { LEVELS_MAP, type TNewEmployee } from './model/types'
export { default as UserCardList } from './ui/UserCardList.vue'
export { default as UserSkillList } from './ui/UserSkillList.vue'
```

Правило: **снаружи фичи — только `@/features/<name>`**. Внутри фичи —
относительные пути или `@/features/<self>/...`.

## 4. Правила границ (что проверяет скрипт)

Обозначения: `@/` = `src/`.

| Зона                                     | Запрещено импортировать                                                                                                                                               |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/shared/lib/**`                      | `vue`, `quasar`, `vue-router`, `pinia`, `firebase/*`, `@/features`, `@/shared/ui`, `@/shared/form`, `@/stores`, `@/pages`, `@/layouts`, `@/router`, `@/lib`, `@/boot` |
| `src/shared/form/**`, `src/shared/ui/**` | `@/features`, `@/stores`, `@/pages`, `@/layouts`, `@/router`, `@/lib`, `@/boot` (разрешены `vue`, `quasar`, `@/shared/*`, `@/types/*`)                                |
| `src/features/*/api/**`                  | `vue`, `quasar`, `vue-router`, `pinia`, `@/features/*` (кроме своей), `@/stores`, `@/pages`, `@/layouts`, `@/router`, `@/boot`                                        |
| `src/features/*/actions/**`              | `quasar`, `@/features/*` (кроме своей), `@/stores`, `@/pages`, `@/layouts`, `@/router`, `@/boot` (разрешён `vue-router`)                                              |
| `src/features/*/model/**`                | `quasar`, `vue-router`, `@/features/*` (кроме своей), `@/stores`, `@/pages`, `@/layouts`, `@/boot`                                                                    |
| `src/features/*/ui/**`                   | `@/features/*` (кроме своей), `@/stores`, `@/pages`, `@/layouts`, `@/router`, `@/boot`                                                                                |
| любая фича снаружи                       | `@/features/<name>/...` глубже `index.ts`                                                                                                                             |
| `src/stores/**`                          | `quasar`, `vue-router`, `@/pages`, `@/layouts`, `@/components`, `@/boot`                                                                                              |
| `src/pages/**`, `src/layouts/**`         | `@/pages/*` (страница не импортирует страницу)                                                                                                                        |
| `src/lib/**`                             | `vue`, `quasar`, `@/features`, `@/stores`, `@/pages`, `@/layouts`, `@/router`, `@/boot`, `@/shared`                                                                   |
| `src/router/**`, `src/boot/**`           | `@/pages/*` (страницы грузятся через `routes.ts` динамически), внутренности фич                                                                                       |

Скрипт `scripts/check-import-boundaries.mjs`:

- читает все `src/**/*.{ts,vue}`;
- извлекает статические импорты, `export … from` и динамические `import('…')`;
- резолвит `@/…` в `src/…`; относительные пути резолвит от файла;
- чистая логика — в `scripts/lib/importBoundaries.mjs` с тестами
  `scripts/lib/importBoundaries.test.mjs` (как у `noStyleBlocks`);
- вывод: `file:line  import  '…'  → правило`;
- exit code 1 при нарушениях; подключается в `npm run lint`.

## 5. Порядок работ

### 4a. Мёртвый код (0.5 ч)

1. Удалить `ExampleComponent.vue`, `EssentialLink.vue`, `example-store.ts`,
   `types/api.ts`, `utils/array.ts`.
2. Из `types/models.ts` удалить `Todo`/`Meta`; `Loading`/`Valid` перенести в
   `features/employees/model/types.ts` (или удалить `TNewEmployeeState`, если
   решим не тащить неиспользуемый тип — см. открытые вопросы).
3. `utils/datetime.ts` → `shared/lib/date.ts` с единственной `isCorrectDate`.
4. `utils/format.ts` и `test/.../format.spec.ts` — по решению (см. §7).

### 4b. `shared/lib` (1 ч)

Перенести без изменения логики: `constants`, `errors` (уже там), `form`,
`generator`, `meta`, `theme`, `date`. Обновить импорты во всех файлах.

### 4c. `shared/form` и `shared/ui` (1–2 ч)

- `types/form.ts` → `shared/form/types.ts`.
- `composables/useForm.ts` → `shared/form/useForm.ts`.
- `components/form-fields/**` → `shared/form/**`.
- `components/form/EssentialForm.vue` → `shared/form/EssentialForm.vue`.
- `features/auth/model/fields.ts` и `features/employees/model/fields.ts`
  принимают константы имён полей из `types/form-names.ts`.
- `components/UserCardList.vue`, `components/UserSkillList.vue` →
  `features/employees/ui/`.
- `components/{SidebarDrawer,RouterMenuLink,ThemeToggler,UserAvatar}.vue` →
  `layouts/components/`.
- `stores/authForms.ts` → `features/auth/model/formFields.ts`;
  `stores/employeeForms.ts` → `features/employees/model/formFields.ts`.
- `types/{emloyee-card,new-employee}.ts` → `features/employees/model/types.ts`.
- `types/index.ts` удалить.

### 4d. Публичные `index.ts` (0.5 ч)

Добавить `features/auth/index.ts` и `features/employees/index.ts`; перевести
страницы, layout, роутер и store на публичные импорты.

### 4e. Guard-скрипт (1–2 ч)

- `scripts/lib/importBoundaries.mjs` + тесты;
- `scripts/check-import-boundaries.mjs`;
- `npm run lint` → добавить вызов;
- `npm run fix` не трогает границы (правило не автофиксится).

### 4f. Ленивый Firestore и замер бандла (0.5 ч)

- `src/lib/firebase/client.ts`: `auth` остаётся синхронным, Firestore —
  ленивый:

  ```ts
  let firestorePromise: Promise<Firestore> | undefined

  export const getDb = (): Promise<Firestore> => {
    firestorePromise ??= import('firebase/firestore').then(({ getFirestore }) =>
      getFirestore(firebaseApp)
    )

    return firestorePromise
  }
  ```

- `employeeRepository` получает `db` через `await getDb()` и импортирует
  `collection/getDocs/addDoc` динамически, чтобы SDK не попадал в чанк
  страницы сотрудников.
- Тестовый mock в `test/vitest/setup-file.ts` обновить под `getDb`.
- Зафиксировать размеры чанков до/после в журнале плана.

## 6. Тесты и проверки

- `scripts/lib/importBoundaries.test.mjs` — зона файла, резолв `@/`,
  кросс-фичевый deep import, запрет quasar в `features/*/api`;
- существующие тесты обновляются только путями импорта (логика не меняется);
- `employee-repository.spec.ts` — мок `getDb` вместо `db`;
- прогон: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`;
- `node scripts/check-import-boundaries.mjs` — 0 нарушений;
- в план `architecture-improvements.md` добавить запись «фаза 4» с размерами
  бандла до/после.

## 7. Решения по открытым вопросам

1. **Доменные конфиги форм.** Перенесены в
   `features/*/model/formFields.ts`: фича владеет своими полями и отдаёт их
   через `index.ts`.
2. **`utils/format.ts`.** Удалён вместе с тестом: в проде не использовался.
   `utils/datetime.ts` сведён к `isCorrectDate` в `shared/lib/date.ts`.
3. **`create-page.sh`.** Переписан под конвенции: kebab-case, `<script setup
   lang="ts">`, без `<style>`, напоминание про `ROUTE_NAME`/`routes.ts`.

## 8. Критерии готовности

- [x] В `src/` нет мёртвых файлов из §1.2.
- [x] Фичи доступны только через `index.ts`; deep imports запрещены скриптом.
- [x] `shared/lib` не зависит от Vue/Quasar/фич.
- [x] `npm run lint` включает проверку границ.
- [x] Firestore не входит в initial preload; размер чанка зафиксирован.
- [x] `lint`, `typecheck`, `test`, `build` — зелёные.

## 9. Журнал выполнения (2026-11-04)

Сделано:

- Переносы: `utils/*` → `shared/lib/*`; формы → `shared/form/*`;
  `UserCardList`/`UserSkillList` → `features/employees/ui`; компоненты
  оболочки → `layouts/components`; стор сотрудников →
  `features/employees/model/store.ts`; фабрики полей → `features/*/model/formFields.ts`.
- `features/auth/actions/useAuthActions.ts` вынесен из `model/`, чтобы
  навигация была явной (зона `feature/actions`, `vue-router` разрешён,
  Quasar — нет).
- Публичные `index.ts` у auth и employees; страницы, layout, router и boot
  переведены на них.
- Удалён мёртвый код и пустые каталоги (`components`, `composables`, `utils`),
  `types/index.ts` заменён явными импортами.
- `scripts/check-import-boundaries.mjs` + `scripts/lib/importBoundaries.mjs` +
  тесты; `check:boundaries` и вызов в `lint`.
- Ленивый Firestore через `getDb()` и динамический импорт SDK в репозитории;
  mock в `test/vitest/setup-file.ts` обновлён.
- `create-page.sh` переписан.
- Документация: `docs/architecture.md`, обновлены `docs/forms.md`,
  `docs/StoresMigration.md`, `README.md`.

Проверки:

- `npm run lint` — зелёный;
- `npm run typecheck` — зелёный;
- `npm test` — 20 файлов, 159 тестов, зелёные;
- `npm run build` — SPA-сборка успешна;
- `node scripts/check-import-boundaries.mjs` — 0 нарушений.

Бандл (без сжатия):

| Состояние | Предзагрузка                                                                             |
| --------- | ---------------------------------------------------------------------------------------- |
| до        | `index` 107 KB + `use-quasar` 64 KB + `client` 551 KB ≈ 722 KB                           |
| после     | `index` 169 KB + `QBtn` 94 KB + `prevent-scroll` 104 KB + `defineProperty` 1 KB ≈ 368 KB |

Чанк Firestore (`index.esm`, 568 KB) больше не входит в `modulepreload` и
загружается по требованию при запросе данных сотрудников.
