# Модульная архитектура стилей (по образцу `ai/fallback`)

## 1. Аудит текущего состояния

Стилей в проекте мало, но организация «как получилось», а не как система:

| Файл                                      | Содержимое                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| `src/css/app.scss`                        | `@import "global"` (устаревший импорт Sass)                                |
| `src/css/_global.scss`                    | `* { font-family; scrollbar-width: thin }`                                 |
| `src/css/quasar.variables.scss`           | брендинг Quasar (`$primary` и т.п.)                                        |
| `src/layouts/scss/main-layout.scss`       | 2 класса фоновых картинок                                                  |
| `src/components/scss/user-card-list.scss` | 1 правило grid                                                             |
| `src/layouts/MainLayout.vue`              | `<style lang="scss">@import './scss/main-layout'</style>`                  |
| `src/components/UserCardList.vue`         | `<style lang="scss">@import './scss/user-card-list'</style>`               |
| `src/components/BaseForm.vue`             | `<style scoped>` 36 строк, генеричные классы `.form-actions`, `.base-form` |

Проблемы:

1. Три разных способа подключения стилей (SFC + `scss/` рядом с компонентом +
   глобальный `css/`), нет единой точки входа.
2. Нет каскадных слоёв и токенов: значения (`8px`, `300px`) захардкожены,
   порядок применения зависит от порядка импортов и специфичности.
3. `scoped` есть только у `BaseForm` → остальные стили глобальные «по факту»,
   но без неймспейсов (`.form-actions`, `.users-list` — слишком общие имена).
4. **Найден баг:** `url("assets/svg/bg-main-layout.svg")` в
   `src/layouts/scss/main-layout.scss` не резолвится. В собранном CSS:
   `url(scss/assets/svg/bg-main-layout.svg)`, файла в `dist/spa` нет →
   фоновые картинки в проде не работают. Починим при переносе
   (`url("@/assets/svg/…")`).

## 2. Что берём из `ai/fallback`

Ориентир — `src/webview/styles/` и `SCSS_MODULES_GUIDE.md`:

1. **Только SCSS-модули**, `<style>` в `.vue` запрещён; стили компонентов —
   flat-партиалы `_<component>.scss` в общем каталоге, подключаются из
   единственной точки входа через `@use`.
2. **Каскадные слои** `@layer`: порядок объявлен один раз в `_reset.scss`,
   каждый партиал целиком внутри ровно одного слоя, неслойных правил нет.
3. **Design-токены** — единственный источник `tokens/*.json`, генератор
   `scripts/build-tokens.mjs` (Style Dictionary) пишет `_tokens.scss`
   (CSS custom properties в слое `tokens`), файл коммитится и не правится
   руками.
4. **BEM** (`block__element--modifier`) + запрет `!important`.
5. **Гайд** (`STYLE_GUIDE.md`) и **guard**, который не даёт вернуть `<style>`
   в компоненты.

## 3. Адаптация под Quasar (главное отличие от `fallback`)

`fallback` — webview без сторонних CSS. У нас Quasar подключает свой
stylesheet **вне слоёв** (`quasar/dist/quasar.sass` в `client-entry.js`
раньше нашего `app.scss`). Неслоёный CSS по спецификации бьёт любой слой,
поэтому:

- Порядок слоёв: `reset → tokens → base → components → utilities`
  (слой `icons` не нужен — иконки приходят из `@quasar/extras` вне слоёв,
  `vendor` — нет сторонних стилей, кроме Quasar).
- **Единственное исключение из «нет неслойных правил»** —
  `_quasar-overrides.scss`: правки стилей самих Quasar-компонентов
  (`.q-btn`, `.q-card`, …). Они обязаны быть неслойными, иначе проиграют
  Quasar. Файл подключается последним и задокументирован в гайде.
- Цветовые токены ссылаются на CSS-переменные Quasar (`var(--q-primary)`,
  `var(--q-dark)`), брендинг остаётся в `quasar.variables.scss`.
- Шрифт `body` задаёт типографика Quasar — не дублируем.

Плата за глобальные стили вместо `scoped`: CSS компонентов попадает в бандл
целиком (у нас это ~1 КБ) и требует BEM-неймспейсов, чтобы классы не
протекали. Для SPA такого размера это нормально и предсказуемо.

## 4. Целевая структура

Каталог оставляем `src/css/` — Quasar резолвит `css: ['app.scss']` строго
относительно `src/css`, и ломать это соглашение ради переименования в
`styles/` не стоит. Внутри — структура как в `fallback`:

```
src/css/
  app.scss                 # единственная точка входа: только @use
  quasar.variables.scss    # брендинг Quasar (не трогаем)
  _reset.scss              # порядок слоёв + нормализация + scrollbar-width
  _tokens.scss             # ГЕНЕРИРУЕТСЯ из tokens/app.json
  _base.scss               # дефолты элементов (появится по мере надобности)
  _quasar-overrides.scss   # неслойный слой-исключение для .q-*
  _main-layout.scss        # бывший src/layouts/scss/main-layout.scss
  _user-card-list.scss     # бывший src/components/scss/user-card-list.scss
  _base-form.scss          # извлечено из BaseForm.vue
  STYLE_GUIDE.md           # правила: слои, токены, BEM, Quasar, чек-лист
tokens/app.json            # источник design-токенов
scripts/build-tokens.mjs   # генератор _tokens.scss
scripts/check-no-style-blocks.mjs  # guard: <style> в .vue запрещён
scripts/lib/noStyleBlocks.mjs + .test.mjs
```

Удаляем: `src/css/_global.scss`, `src/layouts/scss/`, `src/components/scss/`.

## 5. План работ

### 5.1 Токены

- `tokens/app.json` в формате DTCG: группы, которые реально нужны после
  миграции, без «мёртвых» значений:
  - `space` (`xs` 4px, `sm` 8px, `md` 12px, `lg` 16px) — заменит `gap: 8px`
    и будущие отступы;
  - `size.card-min` (`300px`) — минимальная ширина карточки в
    `.user-card-list`;
  - `radius.sm`/`md`, `transition.fast` — только если появятся потребители;
    иначе не заводим (правило «мёртвых токенов не держим»).
- `scripts/build-tokens.mjs` (Style Dictionary 5, формат
  `scss/tokens-layer`, как в `fallback`) + `npm run build:tokens`.
- `_tokens.scss` коммитится; `stylelint`/`oxfmt` его игнорируют.

### 5.2 Слои и база

- `_reset.scss`: `@layer reset, tokens, base, components, utilities;` +
  `box-sizing`, `html/body` + `scrollbar-width: thin` (переезд из
  `_global.scss`).
- `_base.scss`: пока пустой по смыслу — создаём **только** если после
  миграции есть реальные правила. Иначе слой объявлен, файла нет.
- `_quasar-overrides.scss`: файл-заглушка с комментарием-контрактом
  (создаём, чтобы правило было зафиксировано, а не «когда-нибудь»).

### 5.3 Компоненты

- `_main-layout.scss`: `@layer components`, BEM-имена
  (`.main-layout`, `.main-layout__drawer`), картинки через
  `url("@/assets/svg/…")` — чинит баг из п.1.
- `_user-card-list.scss`: `@layer components`, `.user-card-list`
  (вместо `.users-list`), `minmax(var(--size-card-min), 1fr)`.
- `_base-form.scss`: `@layer components`; BEM:
  `.base-form`, `.base-form__fields`, `.base-form__header`,
  `.base-form__actions` + модификаторы `--left|center|right` вместо
  `text-${actionsAlign}` (сейчас это Quasar-утилита `text-align`, которая
  конфликтует со смыслом `justify-content`).
- Правки шаблонов: `MainLayout.vue`, `UserCardList.vue`, `BaseForm.vue` —
  новые классы, `<style>` удаляются.

### 5.4 Точка входа

- `app.scss`: только `@use` в фиксированном порядке
  (`reset, tokens, base?, main-layout, user-card-list, base-form,
  quasar-overrides`); никаких правил и `@import`.
- `quasar.config.ts` не меняется.

### 5.5 Guard и линт

- `scripts/check-no-style-blocks.mjs`: падает, если в `src/**/*.vue` есть
  `<style`. Вызывается из `npm run lint` (рядом с чекером атрибутов).
- Тест `scripts/lib/noStyleBlocks.test.mjs` (vitest уже собирает
  `scripts/**/*.test.mjs`): находит блок в temp-строке, не срабатывает на
  комментарий/`<stylesheet>`.
- `.stylelintrc.json`: `ignoreFiles` для `_tokens.scss`; правило
  `custom-property-pattern`/`scss/at-use-no-unnamespaced` — по ситуации.
- `.oxfmtrc.json`: `_tokens.scss` в `ignorePatterns`.

### 5.6 Документация

- `src/css/STYLE_GUIDE.md` — адаптация гайда `fallback`: слои и почему
  Quasar вне слоёв, токены и генерация, BEM, `_quasar-overrides.scss`,
  запрет `<style>`/`!important`, чек-лист нового компонента.
- `README.md` — раздел «Стили» со ссылкой на гайд и `npm run build:tokens`.
- В этот план — раздел «Результат» после реализации.

## 6. Проверки и критерии готовности

| Проверка                                                | Ожидание                 |
| ------------------------------------------------------- | ------------------------ |
| `grep -rn "<style" src --include=*.vue`                 | пусто                    |
| все партиалы в `@layer`, кроме `_quasar-overrides.scss` | да                       |
| `npm run build:tokens`                                  | `_tokens.scss` без диффа |
| `npm run lint`                                          | 0                        |
| `npm run typecheck`                                     | 0                        |
| `npm test`                                              | 76 + новые тесты guard   |
| `npx quasar build`                                      | успешно, SVG-фоны в dist |
| скриншот dev/прод до и после                            | UI не изменился          |

## 7. Риски

- **Слои vs Quasar:** любые правки `.q-*` из слоёв молча не применятся —
  лечится контрактом `_quasar-overrides.scss` и гайдом.
- **Глобальные стили вместо `scoped`:** возможны коллизии имён; снимается
  BEM и guard-ревью.
- **Токены:** риск «мёртвых» значений — держим минимум, расширяем по факту.
- **Style Dictionary** — новая devDependency (+ `npm run build:tokens` в
  процессе разработки; генерат коммитится, CI не требует сборки токенов).

## 8. Открытые вопросы (нужно подтверждение)

1. **Токены:** полноценный Style Dictionary (как в `fallback`) или ручной
   `_tokens.scss` без новой зависимости?
2. **Каталог:** оставляем `src/css/` (рекомендую) или переезжаем в
   `src/styles/` с `css: ['../styles/app.scss']`?
3. **BEM-переименования** существующих классов (`.users-list` →
   `.user-card-list`, `.form-*` → `.base-form__*`) — согласны?

## 9. Результат

Все три вопроса подтверждены: Style Dictionary, `src/css/`, BEM-переименование.
Реализовано полностью.

### Что сделано

- **Токены:** `tokens/app.json` (DTCG) → `scripts/build-tokens.mjs` (Style
  Dictionary ^5.7.1) → `src/css/_tokens.scss` (слой `tokens`, `:root`).
  Набор минимальный, без мёртвых значений: `--space-sm` (8px) и
  `--size-card-min` (300px). `npm run build:tokens` идемпотентен
  (проверено `md5sum`), генерат добавлен в `.stylelintrc.json`
  (`ignoreFiles`) и `.oxfmtrc.json` (`ignorePatterns`).
- **Слои:** `_reset.scss` объявляет
  `@layer reset, tokens, base, components, utilities;` и содержит
  нормализацию (`box-sizing`, `html/body`, `scrollbar-width: thin` — переехал
  из удалённого `_global.scss`).
- **Quasar-исключение:** `_quasar-overrides.scss` — единственный неслоёный
  файл (пока только контракт-комментарий), подключается последним.
- **Компоненты:** `_main-layout.scss`, `_user-card-list.scss`,
  `_base-form.scss` — всё в `@layer components`, BEM. Удалены
  `src/css/_global.scss`, `src/layouts/scss/`, `src/components/scss/`.
- **Шаблоны:** `MainLayout.vue` (`.main-layout__page` /
  `.main-layout__drawer`), `UserCardList.vue` (`.user-card-list`),
  `BaseForm.vue` (`.base-form__fields`, `.base-form__header`,
  `.base-form__actions` + `--left|center|right` вместо Quasar-утилиты
  `text-*`). `<style>`-блоки удалены из всех SFC.
- **Вход:** `app.scss` — только `@use` (`@import` больше не используется).
- **Guard:** `scripts/check-no-style-blocks.mjs` (+
  `scripts/lib/noStyleBlocks.mjs`, тест `noStyleBlocks.test.mjs` на
  `@vue/compiler-sfc`) входит в `npm run lint`; проверено вручную — временный
  `.vue` со `<style>` даёт exit code 1.
- **Линт:** `selector-class-pattern` переведён на BEM-паттерн
  `block__element--modifier`; сброс со `*::before/::after` переписан через
  `&`-вложенность (требование `scss/selector-nest-combinators`).
- **Документация:** `src/css/STYLE_GUIDE.md` (слои, токены, BEM,
  Quasar-исключение, чек-лист), README — раздел «Styles» и упоминание guard
  в описании `npm run lint`.
- **Побочный баг исправлен:** `url("assets/svg/…")` из старого партиала не
  резолвился — в проде оставался `url(scss/assets/svg/…)` и 404. Теперь пути
  относительные от `src/css/` (`../assets/svg/…`), в `dist/spa` появляется
  `assets/bg-main-layout-*.svg`, `bg-drawer.svg` инлайнится как data URI.
  Фоновые картинки заработали и в dev, и в проде (видно на скриншотах).

### Проверки

| Команда                                  | Результат                                |
| ---------------------------------------- | ---------------------------------------- |
| `grep -rn "<style" src --include=*.vue`  | ✅ пусто                                 |
| `node scripts/check-no-style-blocks.mjs` | ✅ 0 (на временном `.vue` — exit 1)      |
| `npm run build:tokens` (дважды)          | ✅ идентичный `_tokens.scss`             |
| `npm run lint`                           | ✅ 0                                     |
| `npm run typecheck`                      | ✅ 0                                     |
| `npm test`                               | ✅ 9 файлов / 84 теста (+8 тестов guard) |
| `npx quasar build`                       | ✅ успешно, SVG-фоны в `dist/spa`        |
| `quasar dev` + headless Chrome           | ✅ UI совпадает, фоны и иконки на месте  |
| прод-сборка на статик-сервере            | ✅ UI совпадает                          |
