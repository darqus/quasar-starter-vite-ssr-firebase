# Аудит архитектуры и план улучшений

Статус: **фазы 0–4 выполнены**, план закрыт
Дата: 2026-11-03 (обновлён 2026-11-04)
Решения владельца: форма — вариант B (legacy + чистка), SSR — SPA-first,
фильтры сотрудников — AND по заполненным полям.
Проект: `quasar-starter-vite-ssr-firebase` (Quasar + Vite + Vue 3 + Firebase)

## 1. Рамки и базовое состояние

Аудит сделан по исходникам `src/`, конфигурации сборки/линта, тестам и документации.
На момент аудита:

- `npm run lint` — зелёный;
- `npm run typecheck` — зелёный;
- `npm test` — 10 файлов, 86 тестов, зелёные;
- сборка/деплой: `quasar build` → `dist/spa`, `firebase.json` публикует только SPA.

То есть проект технически здоров, речь не о «починить сломанное», а о том, чтобы
убрать архитектурные ловушки, которые начнут стрелять при росте фич.

> Разделы 3-4 — снимок состояния **до** фазы 1. Что уже исправлено, см.
> раздел 5a «Журнал выполнения».

Проверенные гипотезы (не предположения):

- общий мутабельный state полей форм между экземплярами — **воспроизведено тестом**;
- `reset()` пишет `''` в select-поля — **воспроизведено тестом**;
- `SchemaForm.vue` нефункционален, `BaseForm.vue` нигде не используется — проверено по коду;
- SSR в проекте фактически нет, хотя название и ветки кода это обещают;
- `storeAuth.loading` никогда не устанавливается, но используется в шаблонах кнопок.

## 2. Главный вывод

Проект страдает не от «плохого кода», а от **отсутствия одной точки истины в трёх
ключевых местах**:

1. **Состояние формы** — одновременно живёт в конфиге поля (`field.model`), в
   `useForm`, в `QForm`, в сторе и в `Quasar Loading`.
2. **Доступ и сессия** — `loggedIn` в сторе, права в меню, но не в роутере.
3. **Форма как система** — параллельно существуют два движка форм, один мёртвый,
   второй нерабочий, а документация описывает третий (планируемый) как готовый.

Плюс слой доступа к данным размазан между `boot/`, сторами и страницами, из-за
чего доменная логика импортирует Quasar и Router.

## 3. Аудит по severity

### P0 — архитектурные инварианты, которые уже нарушены

#### P0-1. Конфиги полей — мутабельные модульные синглтоны

**Где:** `src/stores/employeeForms.ts:80`, `src/stores/authForms.ts:77-84`,
`src/composables/useForm.ts:56`.

```ts
export const getNewEmployeeFields = NEW_EMPLOYEE_FIELDS() // один массив на весь процесс
const fields = ref([...options.fields]) // мелкая копия: объекты общие
```

**Что происходит:** `useForm` копирует только массив. Объекты полей остаются
общими. Ввод в одной форме виден в другой; при повторном входе на страницу
остаются старые значения.

Воспроизведение (временный тест, затем удалён):

```ts
const a = useForm({ fields: getNewEmployeeFields })
const b = useForm({ fields: getNewEmployeeFields })
a.setFieldValue('fio', 'LEAKED')
b.getFieldValue('fio') // 'LEAKED'
a.fields.value[0] === b.fields.value[0] // true
```

**Последствия:**

- баг навигации «ушёл со страницы — вернулся с данными»;
- при реальном SSR — утечка данных между запросами/пользователями;
- тесты не изолированы, если используют общий конфиг;
- нельзя открыть две формы одного типа одновременно.

**Решение:** фабрики вместо синглтонов (`createEmployeeFields()`), глубокая
инициализация значений в `useForm`, и в целевом виде — разделение
«конфиг поля» и «значения формы» (values map).

#### P0-2. Авторизация не защищает маршруты

**Где:** `src/router/routes.ts`, `src/router/index.ts`, `src/stores/store-auth.ts:35-72`.

- у маршрутов нет `name` и `meta`;
- нет `beforeEach`/guard;
- `loggedIn` влияет только на видимость ссылок в меню;
- `/account` и `/new-employee` открываются прямой ссылкой без сессии;
- навигация строковая: `router.push({ path: ROUTE_TYPE.ACCOUNT })`, а `ROUTE_TYPE`
  содержит сегменты путей (`'account'`), не имена маршрутов.

**Решение:** имена маршрутов + `meta: { requiresAuth, publicOnly, title, icon }`,
единый guard с ожиданием готовности Firebase Auth (`authStateReady()`), меню —
производное от таблицы маршрутов. `loggedIn` — computed от `currentUser`, а не
второй `ref`.

#### P0-3. Два движка форм, оба не готовы

**Где:** `src/components/BaseForm.vue`, `src/components/SchemaForm.vue`,
`src/components/form-fields/FormFields.vue`, `src/types/form.ts`,
`src/types/form.schema.ts`, `src/boot/register-form-fields.ts`.

- Страницы используют `FormFields` (legacy).
- `BaseForm` не используется нигде, при этом при вызове `useForm` **не передаёт
  `schema`** (`BaseForm.vue:75-90`) и дублирует live-валидацию
  (`setupValidateOnChange`, строки 89-93).
- `SchemaForm` не работает: передаёт в `FormInput` весь объект схемы через
  `v-bind`, тогда как компонент ждёт prop `field` (`SchemaForm.vue:60` vs
  `FormInput.vue:12`), не валидирует, не эмитит `update:modelValue`.
- `src/schemas/login.schema.ts` и реестр полей не используются страницами.
- `docs/forms-architecture.md` описывает `BaseForm` как рабочий стандарт, чего нет.

**Последствия:** новый разработчик не понимает, какой движок «правильный»;
правки валидации нужно делать в двух-трёх местах; мёртвый код проходит typecheck
и создаёт ложное чувство покрытия.

**Решение (нужно решение владельца):**

- **Вариант A (рекомендую):** довести schema-driven движок до рабочего состояния,
  перевести формы на него, удалить `BaseForm`/`FormFields`/`types/form.ts`-ветку.
- **Вариант B (дешевле сейчас):** оставить legacy `useForm` + `FormFields`,
  удалить `BaseForm`, `SchemaForm`, `schemas/login.schema.ts`, `form.schema.ts`,
  `registry` и boot-регистрацию, обновить документацию.

#### P0-4. Слой данных внутри boot + магические строки + нет декодирования

**Где:** `src/boot/firebase.ts:27-32`, `src/stores/store-employee-cards.ts:55-75`,
`src/pages/employee/NewEmployeePage.vue:31`.

- boot-файл одновременно инициализирует Firebase и предоставляет data-access
  (`getCollection`, `addDoc`).
- `addDoc` называется как Firebase API, но вызывает `setDoc(doc(collection(...)))`
  — семантика другая (генерирует id, теряет `addDoc`-возможности).
- коллекция `'employees'` — магическая строка в двух местах.
- данные из Firestore читаются через `doc.data()` без валидации/декодирования.
- `getEmployeeList` молча игнорирует пустой ответ (`if (length)`), ошибка чтения
  не обрабатывается, состояния `loading/error` нет.
- загрузка запускается из `setup` компонента (`UserCardList.vue:6`), а не из
  жизненного цикла/эффекта — побочный эффект при каждом рендере/тесте.

**Решение:** `src/lib/firebase/client.ts` (только init), репозитории фич
(`features/employees/api`), константы коллекций, zod-декодер входящих данных,
явные `loading/error`, вызов загрузки из `onMounted`/router prefetch.

#### P0-5. `store-auth` смешивает домен, UI и навигацию

**Где:** `src/stores/store-auth.ts`.

В одном сторе: сессия, `passwordVisibility`, `valid`, `loading`, тексты меню,
Firebase-вызовы, `Notify`, роутер, `Loading`.

- в Actions передаётся `Router` из компонента — стор зависит от вызывающего кода;
- `loading` нигде не присваивается, но завязан на `:loading`/`:disable` кнопок —
  **кнопки не показывают загрузку**;
- `valid` дублирует `isValid` формы и синхронизируется вручную через `watch`;
- `passwordVisibility` дублирует локальное состояние уже внутри `FormInput`;
- ошибки Firebase показываются пользователю как технический код
  (`auth/invalid-credential`) без маппинга на человеческий текст;
- `routerMenuLinks` — представление, а не состояние сессии.

**Решение:** разнести на три слоя:

- `features/auth/api` — Firebase-вызовы, возвращают доменный результат/ошибку;
- `features/auth/model/session` — только `user`, `status`, `ready`, computed
  `isAuthenticated`;
- `features/auth/model/useAuthActions` (или page-composable) — сценарии, навигация
  и UI-фидбек. Quasar `Loading`/`Notify` — только в UI-слое.

#### P0-6. Дублирование сценария «submit → loading → notify → reset»

**Где:** `LoginPage.vue:29-44`, `RegisterPage.vue:29-47`,
`ForgotPage.vue:28-42`, `NewEmployeePage.vue:22-49`.

Четыре почти одинаковых блока `Loading.show()` / try / catch / `finally`. Разница —
только вызов API и текст успеха. Это прямой кандидат на `useAsyncAction` /
`useAuthSubmit`, который инкапсулирует индикатор, маппинг ошибок и сброс.

#### P0-7. Конфигурация окружения и воспроизводимость сборки

- `.env.local` **отслеживается git**, хотя `.gitignore` содержит `.env.local*`
  (добавили в ignore после коммита). В нём Firebase-конфиг и `VITE_ADMIN_UIDS`.
- `.env` (тоже в git) не содержит Firebase-ключей, поэтому чистая сборка без
  локального `.env.local` даст `undefined` в конфиге Firebase.
- `publish.sh` через `sed -i` правит отслеживаемый `.env` (версия/дата) и коммитит
  его — сборка зависит от состояния рабочей копии.
- `VITE_DARK=auto`, но в `boot/auth.ts:14` используется
  `Boolean(import.meta.env.VITE_DARK)`. `Boolean('auto') === true`,
  `Boolean('false') === true` — тема всегда тёмная, режим `auto` не реализован.

**Решение:** `.env.example` с контрактом, `.env.local` — untracked, версия/дата
берутся из `package.json` и build-time `define`, тема — явный парсер
`'auto' | 'true' | 'false'` в одном модуле.

#### P0-8. SSR: название обещает больше, чем есть

**Где:** `README.md`, `src/router/index.ts:22-26`, `src/stores/index.ts:28`,
`boot/auth.ts` (`LocalStorage`), `firebase.json` (только `dist/spa`).

`QUASAR_SERVER` и `ssrContext` фигурируют только в комментариях/ветках; режим
`ssr` не настроен, серверного entry нет, Firebase Client SDK и `LocalStorage`
не готовы к серверу.

**Решение — выбрать одно:**

- **A. SPA-first:** убрать SSR-ветки и из названия/README, зафиксировать решение
  в ADR. Дёшево и честно.
- **B. Настоящий SSR:** отдельный проект: `quasar.config.ts` ssr, серверный entry,
  Firebase Admin/Session Cookies, запрет `LocalStorage`/`window` на сервере,
  per-request Pinia, гидрация. Это существенно дороже и требует бэкенд-решений.

### P1 — слоистость, типы, мёртвый код

#### P1-1. Валидация: единый источник есть, но UI его не показывает

- Есть zod-схемы и `useForm.errors`, но **ни один компонент их не рендерит**:
  пользователь видит только QInput rules, кросс-полевые и объектные ошибки теряются.
- `validation/rules.ts` содержит и константы (используются), и legacy-массивы
  `requiredInput`, `email`, `password`, `date` (не используются) — два API правил.
- `types/form-dto.ts` дублирует `LoginDTO`/`NewEmployeeDTO` из `validation/schemas.ts`
  с другими полями и **не используется**; страницы собирают payload вручную.
- `rulesFromZodField` маппит только первую ошибку — для сложных полей теряется
  остальное.

**Решение:** zod — единственный источник; rules генерируются из схемы; ошибки
рендерятся под полем; удалить legacy-массивы и `types/form-dto.ts`; DTO — это
`z.infer`, маппинг в API-модель — в репозитории.

#### P1-2. Типы и файлы-рудименты

- `types/models.ts` — `Todo`/`Meta` из шаблона; используется только
  `Loading`/`Valid` в одном месте.
- `types/api.ts` — `API.getNsiTypes` нигде не используется.
- `types/emloyee-card.ts` — опечатка в имени; `TEmployeeCardsState` устарел и
  неверен (`selectedFromLevel: TNewEmployee | null` вместо `string | null`).
- `TNewEmployeeState` не используется.
- `ExampleComponent.vue`, `example-store.ts` — шаблонный мусор.
- `utils/datetime.ts` — 370 строк, 12 из 13 экспортов не используются
  (используется только `isCorrectDate`).
- `types/index.ts` — barrel, из которого импортируется только `AUTH_FIELD`;
  остальные импорты идут напрямую → две конвенции импорта.

**Решение:** удалить/починить, зафиксировать конвенцию импортов (без barrel для
внутренних модулей или barrel для публичного API фичи — но не оба сразу).

#### P1-3. `useForm` тянет слишком много и имеет дыры

**Где:** `src/composables/useForm.ts`.

- `validateOnChange` реализован дважды: внутри `useForm` и в
  `setupValidateOnChange`, причём для разных источников (zod vs QForm) — состояние
  `isValid` может «мигать» между ними.
- `reset()` для select пишет `''`, а не `defaultValue`/`null` (подтверждено тестом).
- `getFormData()` возвращает `Partial<InferShape>`, хотя набор полей известен;
  из-за широкого `Fields` вывод типов фактически теряется.
- `InferShape`/`FieldName` не дают реальной типизации, пока `Fields` — рантайм-массив
  с `name: string`.
- `setFieldValue`/`getFormData` используют приведения и небезопасные обходы типов.
- `isSubmitting` и `QForm`-валидация сосуществуют, но на страницах логин/регистрации
  используется мёртвый `store.loading` вместо `isSubmitting`.

**Решение:** или честный типизированный движок (вариант A выше), или упрощение
legacy до предсказуемого минимума: один watcher, корректный reset, нормальные типы.

#### P1-4. Фильтрация сотрудников — бизнес-логика с UI-флагом и спорной семантикой

**Где:** `src/stores/store-employee-cards.ts:23-42`.

- `isFilterVisible` (UI-состояние) управляет тем, применяются ли фильтры;
- условия объединены через `||`, то есть «уровень ИЛИ должность ИЛИ рейтинг»;
  обычно ожидается «И» по выбранным фильтрам;
- выбранные значения типизированы как `string | null` для rate, хотя в
  `TEmployeeCardsState` — объекты сотрудника.

**Решение:** вынести фильтры в отдельный модуль/чистую функцию с явной семантикой
(`AND` по заполненным полям), UI-флаг оставить в компоненте, покрыть тестами.

#### P1-5. Нет route names → строковая навигация

Сейчас `ROUTE_TYPE` — это и путь, и идентификатор. Имя маршрута должно быть
стабильным ключом (`'account'`), путь — деталью конфигурации. Это позволит
типизировать переходы, менять URL без правок по всему коду и строить меню из meta.

#### P1-6. `create-page.sh` противоречит архитектуре

Генератор создаёт `<style lang="scss">` (запрещено guard-скриптом), импортирует
несуществующий `$content-bg-color` и ссылается на несуществующий
`src/types/enums.ts`. Либо обновить под текущие конвенции (SCSS-партиал, `@/`,
routes), либо удалить.

#### P1-7. Документация описывает несуществующее

`docs/forms-architecture.md` и `docs/forms-advanced-architecture.md` частично
противоречат коду и друг другу. Нужен один актуальный документ + ADR на ключевые
решения. Иначе документация становится источником неверных решений.

### P2 — структурные улучшения (не срочно, но задают вектор)

#### P2-1. Feature-sliced структура вместо type-sliced

Сейчас одна фича «auth» размазана по:

```
src/pages/auth/…            # экраны
src/stores/store-auth.ts    # состояние + сценарии
src/stores/authForms.ts     # конфиг полей (не стор!)
src/types/auth.ts           # типы
src/validation/schemas.ts   # валидация
src/schemas/login.schema.ts # ещё одна схема
src/boot/auth.ts            # инициализация
```

Предлагаемая целевая структура (внедрять инкрементально, не одним PR):

```
src/
  app/
    boot/           # только инициализация
    router/         # routes + guards + meta
  features/
    auth/
      api/          # firebase auth use-cases
      model/        # session store, page-composables
      ui/           # формы/страницы auth
      routes.ts
    employees/
      api/          # repositories (firestore), zod decode
      model/        # store, filters
      ui/
      routes.ts
  shared/
    form/           # движок форм + field components
    ui/             # Quasar-адаптеры: notify, loading, feedback
    lib/            # чистые утилиты (без Vue/Quasar/Firebase)
    types/
```

Правила зависимостей:

1. `app → features → shared`, никогда наоборот.
2. Фичи не импортируют внутренности друг друга (только публичный `index.ts`).
3. `shared/lib` не знает про Vue/Quasar/Firebase.
4. `features/*/api` не знает про Vue/Quasar.
5. Quasar UI-плагины — только в `shared/ui` и `*.vue`.

**Как реализовано:** без каталога `app/` — `boot/` и `router/` остались в корне
`src/`; вместо `features/*/routes.ts` маршруты собраны в `src/router/routes.ts`;
навигационные сценарии вынесены в `features/auth/actions`. Актуальное дерево и
правила — `docs/architecture.md`.

Правила стоит закрепить скриптом `scripts/check-import-boundaries.mjs` в стиле
уже существующих guard-скриптов. Это дешевле, чем надеяться на дисциплину.

#### P2-2. Тесты

Сейчас покрыты утилиты и happy-path страниц (с тяжёлыми стабами). Не покрыты:

- `useForm` (reset/validate/изоляция экземпляров) — а именно там баги;
- `store-employee-cards` (фильтры, loading/error);
- route guards;
- репозиторий/декодирование Firestore;
- движок форм (если вариант A).

Предлагаю после каждого этапа добавлять unit-тесты на инварианты, а не на
реализацию. E2E (Playwright) — отдельным решением, не в этом плане.

#### P2-3. Размер бандла и Firebase

`boot/firebase.ts` статически импортирует `firebase/auth` и `firebase/firestore`.
Auth нужен на старте, Firestore — нет. Ленивый импорт Firestore/repository даст
меньший initial bundle. Делать после P0, измеряя результат.

## 4. Целевой поток данных (после P0/P1)

```
Компонент/страница
  → page-composable (сценарий: submit, loading, ошибки, навигация)
    → store (только состояние и геттеры)
    → feature/api (Firebase, возвращает доменные типы/AppError)
      → lib/firebase (инициализация)
  ← shared/ui (notify/loading) ← только на уровне composable/UI
```

Ключевой инвариант: **домен и API не импортируют Quasar и Vue Router**.
Роутер доступен только в page-composable/guard. `Loading`/`Notify` не вызываются
из стора.

## 5. План работ по фазам

Фазы упорядочены так, чтобы не делать большой переписывающий PR и не блокировать
фичи. После каждой фазы: тесты + обновление плана (отметка выполнено).

### Фаза 0. Решения (0.5 дня) — выполнено

- [x] Выбрать судьбу SSR: SPA-first или реальный SSR.
- [x] Выбрать судьбу форм: вариант A (schema-driven) или B (legacy + чистка).
- [x] Подтвердить семантику фильтра сотрудников (AND по заполненным полям?).
- [x] Подтвердить, что layout/дизайн можно не менять.

**Критерий готовности:** решения записаны в ADR, план обновлён.

### Фаза 1. P0: корректность без смены движка (1-2 дня) — выполнено

- [x] `employeeForms`/`authForms`: фабрики, возвращающие новые массивы и новые
      объекты полей; убрать экспорт готовых инстансов.
- [x] `useForm`: глубокая инициализация полей; `reset()` учитывает
      `defaultValue`, для select — `null`/default, а не `''`.
- [x] Удалить дублирующий watcher (`setupValidateOnChange`) и мёртвый
      `storeAuth.loading`/`valid`/`passwordVisibility`; использовать `isSubmitting`.
- [x] Роутер: имена маршрутов, `meta.requiresAuth/publicOnly`, guard с ожиданием
      готовности auth; меню из таблицы маршрутов.
- [x] `boot/auth.ts`: корректный парсинг `VITE_DARK` (`auto|true|false`);
      вынести тему в `shared/ui/theme`.
- [x] `.env.local` — из индекса git, добавить `.env.example`; версия/дата — из
      `package.json`/build-time define, `publish.sh` больше не правит `.env`.
- [x] Решить и задокументировать SSR-статус (или удалить ветки/упоминания).

**Тесты фазы 1:**

- [x] изоляция экземпляров форм (регресс на P0-1);
- [x] reset select/input/default;
- [x] guard: гость → redirect на login; авторизованный → доступ;
- [x] `VITE_DARK` парсер: `auto|true|false`.

**Критерий готовности:** баг с утечкой состояния невозможно воспроизвести;
прямой заход на защищённый маршрут без сессии невозможен; сборка из чистого
checkout воспроизводима. — **выполнено**

### Фаза 2. P0/P1: данные и auth-слой (2-3 дня) — выполнено

- [x] `lib/firebase/client.ts` — только init; убрать data-access из boot.
- [x] `features/employees/api`: константа коллекции, `list/create`, zod-декодер,
      обработка ошибок; `NewEmployeePage` и `UserCardList` используют репозиторий.
- [x] `features/auth/api`: `signIn/signUp/sendReset/signOut/session`; маппинг
      `AuthError.code` → человекочитаемые сообщения.
- [x] `features/auth/model/session`: `user`, `status`, `ready`, computed
      `isAuthenticated`; убрать Router/Notify/Loading из стора.
- [x] `shared/ui/feedback`: `createFeedback` — убрать 4 копии
      `Loading.show/hide`.
- [x] `store-employee-cards`: `loading`, `error`, явная загрузка из `onMounted`,
      чистая функция фильтра с тестами.

**Тесты фазы 2:**

- [x] маппинг `auth/*` кодов и отсутствие технических кодов в UI;
- [x] сессия: unknown → authenticated/anonymous, идемпотентная подписка;
- [x] репозиторий: декодирование, `rate` из строки, пропуск битых документов,
      пустая коллекция, `AppError`, запись с числовым `rate`;
- [x] чистый фильтр сотрудников (AND);
- [x] store: `loading/error`, очистка списка при пустом ответе и ошибке;
- [x] `UserCardList`: загрузка из `onMounted`, loading/error/empty, retry;
- [x] тесты не зависят от `.env.local` (глобальный mock Firebase-клиента).

**Критерии готовности:** ни один store/api-модуль не импортирует Quasar;
`grep -R "quasar" src/features/*/api src/features/*/model` пуст; ошибки Firebase
не показываются как коды; пустая коллекция очищает список. — **выполнено**

### Фаза 3. P1: форма как единая система (2-3 дня, зависит от решения) — выполнено (вариант B)

**Вариант A (schema-driven):**

- [ ] Довести `FormSchema` до рабочего контракта: `values` отдельно от конфига,
      `validation: ZodTypeAny`, `validateOn`, `disabled`, `visible`.
- [ ] `SchemaForm`: корректная передача пропов в field-компоненты (не `v-bind`
      всей схемы), `update:modelValue`, рендер `errors`, submit через `q-form`.
- [ ] Реестр полей: статическая регистрация без boot side-effect.
- [ ] Перевести login → register → forgot → employee по одной форме, с тестами.
- [ ] Удалить `BaseForm`, `FormFields`, `types/form.ts`-ветку, `types/form.schema.ts`
      объединить с новым контрактом.

**Вариант B (legacy):**

- [x] Удалить `BaseForm`, `SchemaForm`, `schemas/`, `types/form.schema.ts`,
      `registry`, `boot/register-form-fields.ts`.
- [x] `useForm`: один механизм валидации, корректные типы, рендер `errors`
      (или удалить `errors`, если объектная валидация не нужна).
- [x] Удалить legacy-массивы правил, `types/form-dto.ts`.

**Общее:**

- [x] Обновить `docs/`: один актуальный документ по формам + ADR.
- [x] Тесты: рендер ошибок, reset, schema-валидация.

### Фаза 4. P2: структура и guard-скрипты (2-4 дня, поэтапно) — выполнено

- [x] `shared/lib`, `shared/ui`, `shared/form`; перенос утилит без изменения логики.
- [x] `features/auth`, `features/employees` с публичными `index.ts`.
- [x] `scripts/check-import-boundaries.mjs` + npm script в `lint`.
- [x] Удалить мёртвый код (`ExampleComponent`, `example-store`, `types/api`,
      `Todo/Meta`, неиспользуемые функции `datetime`, `form-dto`).
- [x] Починить/удалить `create-page.sh`.
- [x] Ленивый Firestore, замер бандла.

Детальный план и журнал фазы: `plan/phase-4-structure.md`.

## 5a. Журнал выполнения

### 2026-11-03 — фазы 0 и 1

Сделано:

- `employeeForms.ts`/`authForms.ts` переведены на фабрики; экспорт готовых
  инстансов удалён; `useForm` глубоко копирует поля, массивы `rule` и `options`.
- `useForm.reset()` учитывает `defaultValue`; select сбрасывается в `null`,
  текстовые поля — в `''`; `errors` очищаются; удалён дублирующий
  `setupValidateOnChange`.
- `store-auth` очищен от UI-состояния (`loading`, `valid`,
  `passwordVisibility`, `isCheckedPolicy`, меню); сессия — `currentUser` +
  `status` + computed `isAuthenticated`; добавлены идемпотентный
  `watchAuthStateChanged()` и `waitUntilReady()`.
- Страницы логина/регистрации/восстановления используют `isSubmitting` вместо
  мёртвого `storeAuth.loading`.
- Роутер: `ROUTE_NAME`/`ROUTE_PATH`, `meta` (`title`, `icon`, `menu`,
  `menuVisibility`, `requiresAuth`, `publicOnly`), guard
  `src/router/guards.ts`, меню из таблицы маршрутов (`src/router/menu.ts`).
  Навигация переведена на `{ name }`.
- SSR-ветки удалены, принят `docs/adr/0001-spa-first.md`.
- `VITE_DARK` парсится как `auto|true|false` (`src/utils/theme.ts`).
- `.env.local` снят с индекса git, добавлен `.env.example`; версия/дата сборки
  задаются через `define` (`quasar.config.ts`), `publish.sh` больше не правит
  `.env`.
- Фильтры сотрудников: AND по заполненным полям, скрытие панели очищает выбор.
- Тип `FieldModelByName` исправлен: значения полей больше не выводятся как
  `never` для рантайм-списков.

Проверки:

- `npm run lint` — зелёный;
- `npm run typecheck` — зелёный;
- `npm test` — 16 файлов, 113 тестов, зелёные;
- `npm run build` — SPA-сборка успешна.

Новые тесты:

- `test/vitest/__tests__/form-useForm.spec.ts` — изоляция экземпляров, reset,
  defaultValue, очистка ошибок;
- `test/vitest/__tests__/theme.spec.ts` — парсер `VITE_DARK`;
- `test/vitest/__tests__/router-guards.spec.ts` — guard и ожидание сессии;
- `test/vitest/__tests__/router-menu.spec.ts` — меню из meta;
- `test/vitest/__tests__/router-routes.spec.ts` — имена, meta и состав меню
  в реальной таблице маршрутов;
- `test/vitest/__tests__/employee-store-filters.spec.ts` — AND-фильтры и сброс.

Не входило в фазу 1 и осталось на потом:

- репозитории/`lib/firebase` и вынос `Loading`/`Notify` из стора — фаза 2;
- удаление `BaseForm`/`SchemaForm`/реестра — фаза 3 (вариант B);
- feature-sliced структура и guard-скрипт границ импортов — фаза 4.

### 2026-11-03 — фаза 2

Сделано:

- `src/lib/firebase/client.ts` — только инициализация `auth`/`db`;
  `src/boot/firebase.ts` превращён в boot-файл без data-access.
- `src/features/auth/api/authApi.ts` — тонкие обёртки Firebase Auth
  (`signIn`, `signUp`, `sendReset`, `signOutUser`, `observeAuthState`).
- `src/features/auth/model/authErrors.ts` — маппинг `auth/*` кодов в
  человекочитаемые сообщения; технические коды в UI больше не попадают.
- `src/features/auth/model/session.ts` — сессия без Router/Notify/Loading:
  `currentUser`, `status`, `isAuthenticated`, `loggedIn`, идемпотентная
  подписка и `waitUntilReady()`. Старый `src/stores/store-auth.ts` удалён.
- `src/features/auth/model/useAuthActions.ts` — сценарии login/register/reset/
  logout: провайдер → `createFeedback` → навигация/уведомление.
- `src/features/employees/api/employeeRepository.ts` — `EMPLOYEES_COLLECTION`,
  `listEmployees` (zod-декодирование, `rate` из строки, пропуск битых
  документов), `createEmployee` (валидация и числовой `rate`), `AppError`.
- `src/features/employees/model/filters.ts` — чистая AND-функция фильтра.
- `src/stores/store-employee-cards.ts` — repository вместо `boot/firebase`,
  состояния `loading`/`error`, очистка списка при пустом ответе и ошибке.
- `src/components/UserCardList.vue` — загрузка из `onMounted`, состояния
  loading/error/empty и retry.
- Auth-страницы и `NewEmployeePage` используют `useAuthActions`/`createFeedback`;
  `Loading` и `createNotify` из страниц убраны, `src/utils/notify.ts` удалён.
- `test/vitest/setup-file.ts` глобально мокает `@/lib/firebase/client`, поэтому
  тесты работают без `.env.local` и Firebase-ключей.

Проверки:

- `npm run lint` — зелёный;
- `npm run typecheck` — зелёный;
- `npm test` — 19 файлов, 137 тестов, зелёные (в том числе без `.env.local`);
- `npm run build` — SPA-сборка успешна;
- `grep -R "quasar" src/features/*/api src/features/*/model` — пусто.

Новые/обновлённые тесты:

- `auth-errors.spec.ts` — маппинг кодов и отсутствие технических кодов в UI;
- `auth-session.spec.ts` — unknown → authenticated/anonymous, одна подписка;
- `auth-pages.happy.spec.ts` — успех/ошибки/навигация через `useAuthActions`;
- `employee-repository.spec.ts` — декодирование, `rate`, битые документы,
  пустая коллекция, `AppError`, запись;
- `employee-filters.spec.ts` — чистая AND-логика;
- `employee-store-filters.spec.ts` — loading/error/пустой ответ;
- `employee-new.smoke.spec.ts` — вызов репозитория и reset;
- `user-card-list.spec.ts` — загрузка из `onMounted`, loading/error/empty/retry;
- `store-auth.notify.spec.ts` удалён вместе со старым store.

Не входило в фазу 2 и осталось на потом:

- удаление `BaseForm`/`SchemaForm`/реестра — фаза 3 (вариант B) — **сделано**;
- feature-sliced публичные `index.ts` и guard-скрипт границ импортов — фаза 4;
- ленивый Firestore и уменьшение initial bundle — фаза 4.

### 2026-11-03 — фаза 3 (вариант B: один legacy-движок)

Сделано:

- Удалён мёртвый второй движок форм: `components/BaseForm.vue`,
  `components/SchemaForm.vue`, `components/form-fields/registry.ts`,
  `boot/register-form-fields.ts`, `types/form.schema.ts`, `schemas/login.schema.ts`,
  `types/form-dto.ts`, `css/_base-form.scss` (и его `@use` в `app.scss`).
- `quasar.config.ts`: boot-список сокращён до `['auth', 'firebase']`.
- `types/form.ts`: `BaseFormField` переименован в `BaseField`.
- `validation/rules.ts`: удалены неиспользуемые legacy-массивы правил
  (`requiredInput`, `requiredSelect`, `word`, `email`, `password`, `phone`,
  `date`); `MESSAGES` и `REGEXP` оставлены как словарь для zod-хелперов.
- `useForm`:
  - `validate()` при наличии `schema` больше не вызывает `QForm.validate()` —
    zod единственный источник, двойной проверки нет;
  - `getFormData()` возвращает `Record<string, unknown>` (`FormData`);
  - удалены мёртвые `updateField`/`addField`/`removeField`.
- `FormFields` принимает `errors` и передаёт `errors[field.name]` в поля;
  `FormInput`/`FormSelect`/`FormTextArea`/`FormDatePicker` показывают первую
  ошибку через `error`/`error-message`.
- Auth-страницы и `NewEmployeePage` передают `:errors="errors"` в `FormFields`.
- Документация: создан `docs/forms.md` (единственный актуальный документ),
  ADR `docs/adr/0002-legacy-form-engine.md`; удалены четыре устаревших
  документа по формам; README ссылается на `docs/forms.md`;
  `src/css/STYLE_GUIDE.md` переведён на примеры `user-card-list`/`main-layout`.

Проверки:

- `npm run lint` — зелёный;
- `npm run typecheck` — зелёный;
- `npm test` — 20 файлов, 139 тестов, зелёные;
- `npm run build` — SPA-сборка успешна.

Новые тесты:

- `form-errors.spec.ts` — рендер zod-ошибок под соответствующими полями и
  отсутствие `q-field--error` при пустом `errors`.

Не входило в фазу 3 и осталось на потом:

- `shared/lib`, `shared/ui`, `shared/form`; публичные `features/*/index.ts` —
  **сделано в фазе 4**;
- `scripts/check-import-boundaries.mjs` в `lint` — **сделано в фазе 4**;
- удаление прочего мёртвого кода (`ExampleComponent`, `example-store`,
  `types/api`, `Todo/Meta`, неиспользуемые `datetime`) — **сделано в фазе 4**;
- `create-page.sh`, ленивый Firestore и замер бандла — **сделано в фазе 4**.

### 2026-11-04 — фаза 4 (структура, границы, мёртвый код)

Сделано:

- Структура приведена к feature-sliced:
  - `src/shared/lib/` — `errors`, `date`, `theme`, `meta`, `generator`,
    `constants`;
  - `src/shared/form/` — `useForm`, `FormFields`, поля, `EssentialForm`,
    `types`, `access`;
  - `src/shared/ui/` — `feedback`;
  - `src/features/auth/{api,model,actions}` и
    `src/features/employees/{api,model,ui}` с публичными `index.ts`;
  - `src/features/auth/model/fields.ts` и
    `src/features/employees/model/fields.ts` вместо `types/form-names.ts`;
  - доменные типы сотрудников — `features/employees/model/types.ts`;
  - стор сотрудников перенесён в `features/employees/model/store.ts`;
  - компоненты оболочки — `src/layouts/components/`.
- `src/utils/`, `src/composables/`, `src/components/` удалены; `types/index.ts`
  удалён, импорты стали явными.
- Удалён мёртвый код: `ExampleComponent`, `EssentialLink`, `example-store`,
  `types/api`, `utils/array`, `utils/format` (+ тест), `utils/datetime`
  (осталась только `isCorrectDate`), `Todo/Meta`, `TNewEmployeeState`,
  `types/models.ts`.
- Добавлен `scripts/check-import-boundaries.mjs` и чистая логика
  `scripts/lib/importBoundaries.mjs`; проверка входит в `npm run lint`,
  отдельно — `npm run check:boundaries`.
- `create-page.sh` переписан: kebab-case, `<script setup lang="ts">`, без
  `<style>`, напоминание про `ROUTE_NAME`/`routes.ts`.
- Firestore стал ленивым: `client.ts` отдаёт `getDb()` через
  `import('firebase/firestore')`; репозиторий грузит SDK по требованию.
- Документация: `docs/architecture.md` (слои и правила границ),
  `docs/forms.md` и `docs/StoresMigration.md` обновлены под новые пути,
  README ссылается на архитектуру.

Проверки:

- `npm run lint` — зелёный (включая границы импортов);
- `npm run typecheck` — зелёный;
- `npm test` — 20 файлов, 159 тестов, зелёные;
- `npm run build` — SPA-сборка успешна.

Бандл (без сжатия):

- было: предзагрузка `index` 107 KB + `use-quasar` 64 KB + `client` 551 KB
  ≈ 722 KB; Firestore внутри `client`;
- стало: предзагрузка `index` 169 KB + `QBtn` 94 KB +
  `prevent-scroll` 104 KB + `defineProperty` 1 KB ≈ 368 KB;
- чанк Firestore (`index.esm`, 568 KB) больше не в `modulepreload`,
  загружается по требованию при запросе данных сотрудников.

Новые тесты:

- `scripts/lib/importBoundaries.test.mjs` — зоны, резолв `@/`, публичный API
  фич, запрет Quasar в api/model, направление слоёв, поиск импортов и
  нарушений.

## 6. Быстрые победы (можно сделать сегодня, без большого рефакторинга)

1. Фабрики полей + глубокая инициализация в `useForm` — убирает утечку состояния.
2. Корректный `reset()` для select.
3. Удалить мёртвый `storeAuth.loading`/`valid`/`passwordVisibility` и
   подключить `isSubmitting`.
4. Парсер `VITE_DARK` (`auto|true|false`).
5. `git rm --cached .env.local`, добавить `.env.example`, поправить `publish.sh`.
6. Route names + guard на `requiresAuth` (даже без переноса структуры).
7. Удалить `ExampleComponent`, `example-store`, `types/api`, `types/form-dto`.
8. Обновить/удалить устаревшие docs по формам.

## 7. Что сознательно не предлагаю сейчас

- Полный переход на i18n — полезно, но только после стабилизации форм и маршрутов.
- Замена Pinia/Quasar/Zod — стек адекватен задаче.
- Немедленный feature-sliced «большой взрыв» — риск сломать рабочие формы;
  только инкрементально, после P0.
- Микрооптимизации бандла до P0 — сначала корректность.

## 8. Риски

| Риск                                                     | Митигация                                                        |
| -------------------------------------------------------- | ---------------------------------------------------------------- |
| Рефакторинг форм ломает рабочие сценарии                 | Вариант B или поэтапный A с тестами на каждую форму              |
| Guard ломает SSR/гидрацию                                | Сначала решение по SSR, затем guard                              |
| Смена структуры каталогов конфликтует с текущими ветками | Делать после merge, отдельными PR по фичам                       |
| `.env` чистка ломает деплой                              | Сначала `.env.example` + CI/build-проверка, потом untrack        |
| «Ещё один движок» вместо удаления старого                | Явный критерий: после фазы 3 в `src/` остаётся ровно один движок |

## 9. Критерии завершения всего плана

- [x] В проекте ровно один механизм форм и один механизм валидации.
- [x] Нет мутабельных модульных синглтонов состояния формы.
- [x] Защищённые маршруты закрыты guard-ом; меню строится из маршрутов.
- [x] Stores не импортируют Quasar/Router; API-слой не знает про Vue.
- [x] Сборка воспроизводима из чистого checkout по `.env.example`.
- [x] `lint`, `typecheck`, тесты зелёные; новые инварианты покрыты тестами.
- [x] Документация соответствует коду; решения зафиксированы в ADR.
- [x] Мёртвый код и генератор страниц приведены в соответствие конвенциям.

## 10. Вопросы к владельцу — решено 2026-11-03

1. **SSR:** SPA-first. Ветки удалены, решение — `docs/adr/0001-spa-first.md`.
2. **Формы:** вариант B — legacy `useForm` + `FormFields`, чистка в фазе 3.
3. **Фильтр сотрудников:** AND по заполненным фильтрам.
4. **Порядок:** фазы 1 (P0-корректность), 2 (данные/auth), 3 (формы) и
   4 (структура, границы, бандл) выполнены. План закрыт.
