# Style guide

Стили приложения живут в SCSS-модулях `src/css/`. В Vue-компонентах
`<style>` запрещён: этот запрет проверяет `node scripts/check-no-style-blocks.mjs`
(входит в `npm run lint`).

Архитектура повторяет `ai/fallback/src/webview/styles`, с одной поправкой
на Quasar — см. §2.

## 1. Принципы

1. Один компонент — один партиал `_<component>.scss` в `src/css/`.
2. Каждый партиал целиком лежит в одном каскадном слое (`@layer`).
3. Числовые значения — только из токенов (`var(--space-sm)`), не хардкод.
4. Классы — BEM: `block__element--modifier`, без `!important`.
5. Точка входа `app.scss` содержит только `@use` — ни одного правила.

## 2. Каскадные слои

Порядок объявлен один раз в `_reset.scss`, который загружается первым:

```
reset → tokens → base → components → utilities
```

Поздний слой побеждает ранний **независимо от специфичности** селекторов.

| Слой         | Содержимое                                                | Файлы                                  |
| ------------ | --------------------------------------------------------- | -------------------------------------- |
| `reset`      | нормализация (`box-sizing`, `html/body`, скроллбары)      | `_reset.scss`                          |
| `tokens`     | CSS custom properties из `tokens/app.json`                | `_tokens.scss` (генерируется)          |
| `base`       | дефолты оболочки приложения (появляются по необходимости) | `_base.scss` (нет, пока не нужен)      |
| `components` | все BEM-компоненты                                        | все остальные партиалы                 |
| `utilities`  | опциональные классы (`.u-*`)                              | `_utilities.scss` (нет, пока не нужен) |

### Почему Quasar — исключение

Quasar подключает свой stylesheet **вне слоёв** (в `client-entry.js` до
`app.scss`), а неслоёный CSS по спецификации важнее любого слоя. Значит:

- правила из наших слоёв **не могут** переопределять `.q-btn`, `.q-card`,
  `.q-field` и другие классы Quasar;
- правки Quasar-компонентов пишем только в `_quasar-overrides.scss` —
  единственный неслоёный файл, подключён последним;
- всё остальное — в слоях; «просто правило вне слоя» ломает архитектуру.

## 3. Design-токены

Единственный источник значений — `tokens/app.json` (формат DTCG):

```json
{
  "space": { "sm": { "value": "8px", "description": "…" } },
  "size": { "card-min": { "value": "300px", "description": "…" } }
}
```

Генерация:

```bash
npm run build:tokens   # node scripts/build-tokens.mjs (Style Dictionary)
```

Результат — `src/css/_tokens.scss` (слой `tokens`, `:root`), файл
коммитится и **не редактируется руками**; `stylelint` и `oxfmt` его
игнорируют.

Правила:

1. Мёртвых токенов не держим: новый токен появляется вместе с первым
   потребителем.
2. Цвета берём из Quasar-переменных (`var(--q-primary)`, `var(--q-dark)`,
   …), брендинг меняется в `quasar.variables.scss`.
3. Арифметика — через `calc()`: `calc(var(--space-sm) * 2)`.
4. Шрифт `body` задаёт типографика Quasar, дублировать его не нужно.

## 4. BEM и неймспейсы

Стили глобальные (без `scoped`), поэтому имя класса — это и есть
неймспейс:

```scss
@layer components {
  .base-form__actions {
    display: flex;
    gap: var(--space-sm);

    &--left {
      justify-content: flex-start;
    }
  }
}
```

Паттерн классов зафиксирован в stylelint:

```json
"selector-class-pattern": "^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z][a-z0-9]*(-[a-z0-9]+)*)?(--[a-z][a-z0-9]*(-[a-z0-9]+)*)?$"
```

Запрещены «голые» имена вроде `.form-actions`, `.users-list`: они
протекают на всё приложение.

### Не смешивайте с layout-утилитами Quasar

Элемент, которому наш модуль задаёт `display` (`grid`/`flex`), **не должен**
нести Quasar-классы `.row`/`.column`: они неслоёные и перебивают наш слой —
контейнер молча станет flex-строкой. Отступы в таких сетках задаём сами
через `gap`, а не `q-gutter-*`.

```vue
<!-- было: .row побеждает display: grid из слоя -->
<div class="row q-gutter-md user-card-list">

<!-- стало -->
<div class="user-card-list">
```

## 5. Файлы

```
src/css/
├── app.scss               # вход: только @use, порядок слоёв — в ./reset
├── quasar.variables.scss  # брендинг Quasar (SCSS-переменные, не CSS)
├── _reset.scss            # стейтмент порядка слоёв + нормализация
├── _tokens.scss           # ГЕНЕРИРУЕТСЯ из tokens/app.json
├── _quasar-overrides.scss # неслоёный слой-исключение для .q-*
└── _<component>.scss      # BEM-партиал компонента
```

- Имя партиала = имя компонента в kebab-case: `BaseForm.vue` →
  `_base-form.scss`.
- Импорты только через `@use './name';` (`@import` запрещён — устарел).
- Статические ассеты: путь относительно файла (`../assets/svg/x.svg`).
  Абсолютные и `~`-пути не используются.

## 6. Guard и линт

| Инструмент                             | Что проверяет                                    |
| -------------------------------------- | ------------------------------------------------ |
| `stylelint` (`standard-scss` + recess) | порядок свойств, BEM-паттерн, ошибки синтаксиса  |
| `oxfmt`                                | форматирование SCSS (2 пробела, двойные кавычки) |
| `check-no-style-blocks.mjs`            | отсутствие `<style>` в `src/**/*.vue`            |
| `check-vue-attribute-order.mjs`        | порядок атрибутов в шаблонах                     |

`npm run lint` запускает всё вместе, `npm run fix` — автоисправление.
Тесты guard-скрипта: `scripts/lib/noStyleBlocks.test.mjs`.

## 7. Чек-лист нового компонента

1. Партиал `src/css/_<component>.scss`, весь контент в `@layer components`.
2. Значения — токены; нетокенизированное значение → сначала токен в
   `tokens/app.json` + `npm run build:tokens`.
3. BEM-классы в шаблоне, никакого `<style>`.
4. Цвета — `var(--q-*)`, при необходимости производных оттенков —
   `color-mix()`.
5. `npm run build:tokens && npm run lint && npm run typecheck && npm test`.
