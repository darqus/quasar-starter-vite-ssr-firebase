# Обновление зависимостей и Quasar CLI 2 → 3

Статус: **выполнено**
Дата: 2026-11-03
Ветка: `chore/deps-and-quasar-v3`
Проект: `quasar-starter-vite-ssr-firebase` (Quasar + Vite + Vue 3, npm)

## 1. Что есть сейчас

Установлено (после перехода на npm и свежего `npm install`):

| Пакет                 | Установлено     | Последняя | Тип обновления  |
| --------------------- | --------------- | --------- | --------------- |
| `@quasar/app-vite`    | 2.6.2           | 3.10.3    | **major**       |
| `@quasar/extras`      | 1.18.0          | 2.1.0     | **major**       |
| `@quasar/vite-plugin` | 1.12.0          | 2.0.2     | **major**       |
| `vue-router`          | 4.6.4           | 5.4.0     | **major**       |
| `pinia`               | 3.0.4           | 4.1.0     | **major**       |
| `firebase`            | 12.19.0         | 13.2.0    | **major**       |
| `vite-plugin-checker` | 0.10.3          | 0.14.5    | major (0.x)     |
| `vite-tsconfig-paths` | 5.1.4           | 6.1.1     | major           |
| `@types/node`         | 24.19.2         | 26.6.6    | major           |
| `happy-dom`           | 18.0.1          | 21.0.4    | major           |
| `typescript`          | 5.9.3           | 7.0.2     | major (см. 2.6) |
| `quasar`              | 2.35.2          | 2.35.2    | — уже latest    |
| `vue`                 | 3.5.21 (pin)    | 3.5.44    | patch           |
| `vue-tsc`             | 3.3.14          | 3.3.14    | —               |
| `vitest`              | 5.1.0           | 5.1.0     | —               |
| `oxlint` / `oxfmt`    | 1.90.0 / 0.75.0 | те же     | —               |
| `zod`                 | 4.6.7           | 4.6.7     | —               |

`quasar` (runtime-библиотека) уже на последней 2.x, обновлять её не нужно —
«обновить Quasar» здесь означает **Quasar CLI (`@quasar/app-vite`) 2 → 3**.

## 2. Проверенные факты (не предположения)

### 2.1 `@quasar/app-vite` 3

Официальный upgrade guide лежит внутри самого пакета
(`node_modules/@quasar/app-vite/dist/mcp/quasar-cli-vite/upgrade-guide.md`).
Ключевое для нашего проекта:

- `#q-app/wrappers` → `#q-app`; вместо `boot`, `route`, `store` из
  `quasar/wrappers` — `defineBoot`, `defineRouter`, `defineStore`.
- **Остался только алиас `@/`** (указывает на `/src`). Алиасы `src/`, `app/`,
  `components/`, `pages/`, `stores/` и т.д. удалены.
- `process.env` → `import.meta.env`; константы Quasar получили префикс
  `QUASAR_` (`process.env.SERVER` → `import.meta.env.QUASAR_SERVER`).
- `build.target` по умолчанию `node22`; Node 20 больше не поддерживается
  (движок CLI: `^30 || ^28 || ^26 || ^24 || ^22.22.0`).
- Сборка `src-*`-файлов переехала с esbuild на Rolldown; обычная SPA-сборка
  (`quasar build`) работает как раньше.
- `build.rawDefine`, `build.env`, `build.analyze`, `polyfillModulePreload`
  удалены — мы их не используем.
- `build.typescript.vueShim` и `build.vitePlugins` остались.
- `quasar prepare`, `postinstall`, `quasar clean` — остались.
- Типы `ImportMetaEnv` теперь генерируются автоматически в
  `.quasar/quasar.d.ts` из `.env` и `build.define`/`defineEnv`; блок
  `declare namespace NodeJS { interface ProcessEnv }` больше не нужен.
- В `index.html` переменные шаблона прежние (`productName`, `ctx.mode` и т.д.).

### 2.2 `@quasar/extras` 2

Из release notes: пакет стал **ESM-only**, удалены старые иконочные наборы
(fontawesome 5/6, ionicons 5–7, mdi 3–6). У нас используются `roboto-font` и
`material-icons` — оба на месте, импорты менять не нужно.

### 2.3 `vue-router` 5

Release notes v5.0.0: «a _boring_ release», ломающих изменений для обычного
(не файлового) роутинга нет — в ядро влит `unplugin-vue-router`.
Но peer-требование: `vue ^3.5.34`, поэтому **`vue` придётся поднять с 3.5.21
до 3.5.44** (сейчас пин ниже минимального требования).

### 2.4 `pinia` 4

Ломающих изменений API нет: ESM-only + `@vue/devtools-api@^8` теперь
**обязательный peer** (устанавливается отдельно). Добавим его явно в
`dependencies`, чтобы не зависеть от авто-установки peer'ов npm.

### 2.5 `firebase` 13

Ломающие изменения только в `@firebase/ai` (AI Logic). Проект использует
`firebase/app`, `firebase/auth`, `firebase/firestore` — API не менялся.

### 2.6 `typescript` 7 — **не обновляем**

`typescript@7` — это нативная (Go) реализация: `main: null`, вместо JS API
только `unstable/*`, бинарник `bin/tsc`. `vue-tsc` построен на классическом
TypeScript Compiler API, которого в 7 нет. Обновление сломает `npm run
typecheck`. Остаёмся на `typescript@^5.9.3`; вернёмся к вопросу, когда
`vue-tsc` заявит поддержку 7. Промежуточной стабильной 6.x не существует
(есть только `6.0.0-beta`).

## 3. План изменений

### 3.1 `package.json`

```jsonc
"dependencies": {
  "@quasar/extras": "^2.1.0",
  "@vue/devtools-api": "^8.2.1",   // новый обязательный peer pinia 4
  "firebase": "^13.2.0",
  "pinia": "^4.1.0",
  "quasar": "^2.35.2",
  "vue": "3.5.44",                  // >= 3.5.34 для vue-router 5
  "vue-router": "^5.4.0",
  "zod": "^4.6.7"
},
"devDependencies": {
  "@quasar/app-vite": "^3.10.3",
  "@quasar/vite-plugin": "^2.0.2",
  "@types/node": "^26.6.6",
  "@vitejs/plugin-vue": "^6.0.10",
  "@vue/test-utils": "^2.5.1",
  "autoprefixer": "^10.6.2",
  "happy-dom": "^21.0.4",
  "typescript": "^5.9.3",           // осознанно без 7
  "vite-plugin-checker": "^0.14.5",
  "vue-tsc": "^3.3.14"
  // vite-tsconfig-paths: удаляем, см. 3.5
},
"engines": {
  "node": "^30 || ^28 || ^26 || ^24 || ^22.22.0",
  "npm": ">= 6.13.4"
}
```

### 3.2 `quasar.config.ts`

- `import { defineConfig } from '#q-app/wrappers'` → `from '#q-app'`.
- `build.target.node: 'node20'` → `'node22'`.
- Удалить неиспользуемые блоки `ssr`, `pwa`, `electron`, `cordova`,
  `capacitor`, `bex`: проект SPA-only (нет `src-ssr`, `src-pwa`,
  `src-electron`), а часть их полей в v3 переименована/удалена. Это убирает
  мёртвый конфиг и будущие ошибки типов.
- `build.typescript.vueShim: true` оставляем (не ломает `vue-tsc` и Volar).
- `vitePlugins` (`vite-plugin-checker` с `vueTsc: true`) — без изменений.

### 3.3 Обёртки Quasar

| Файл                               | Было                                | Станет                     |
| ---------------------------------- | ----------------------------------- | -------------------------- |
| `quasar.config.ts`                 | `defineConfig` из `#q-app/wrappers` | `defineConfig` из `#q-app` |
| `src/boot/auth.ts`                 | `boot` из `quasar/wrappers`         | `defineBoot` из `#q-app`   |
| `src/boot/register-form-fields.ts` | `boot` из `quasar/wrappers`         | `defineBoot` из `#q-app`   |
| `src/router/index.ts`              | `route` из `quasar/wrappers`        | `defineRouter` из `#q-app` |
| `src/stores/index.ts`              | `store` из `quasar/wrappers`        | `defineStore` из `#q-app`  |

### 3.4 Алиасы `src/` → `@/`

В коде 128 импортов `from 'src/...'`, 14 в тестах и 2 мока
(`vi.mock('src/...')`), плюс примеры в 4 файлах `docs/`.

Делаем **миграцию на `@/`**, а не инъекцию старых алиасов через
`build.alias`: `@/` — единственный алиас, который Quasar CLI v3 и экосистема
Vue считают стандартом, и он же попадает в генерируемый
`.quasar/tsconfig.json`. Правка механическая, проверяется `typecheck` и
тестами.

Затрагиваются: `src/**/*.{ts,vue}`, `test/**/*.ts`, `docs/*.md`
(примеры кода). Импорты вида `import ... from 'src/...'` и строки
`vi.mock('src/...')`.

### 3.5 Тесты: `vitest.config.ts`

Vite 8 умеет резолвить `paths` из tsconfig нативно
(`resolve.tsconfigPaths: true`, по умолчанию `false`), а `vite-tsconfig-paths`
при каждом запуске пишет предупреждение о том, что плагин больше не нужен.

- Удалить `vite-tsconfig-paths` из зависимостей и из `vitest.config.ts`.
- Добавить `resolve: { tsconfigPaths: true }`.
- Если нативный резолвер не подхватит `extends` — откат на
  `vite-tsconfig-paths@^6.1.1` (зафиксировать в разделе «Результат»).

### 3.6 `process.env` и типы окружения

- `src/router/index.ts`: `process.env.SERVER` → `import.meta.env.QUASAR_SERVER`.
- `src/env.d.ts`: удалить блок `declare namespace NodeJS { interface
  ProcessEnv … }` — в v3 он не нужен, а `.quasar/quasar.d.ts` сам объявляет
  `ImportMetaEnv` из `.env` (все наши переменные с префиксом `VITE_`).
  Файл оставляем только как точку расширения, если позже понадобятся
  кастомные типы (иначе — удалить).
- `vite.config.ts` в корне: файл из стартера, нигде не используется
  (`quasar.config.ts` + `vitest.config.ts`), содержит мёртвый
  `process.env.NODE_ENV`. Предлагаю удалить.

### 3.7 Документация

- `README.md`: требование к Node (`>= 22.22`), актуальные команды.
- `docs/*.md`: примеры импортов `src/...` → `@/...`.
- `plan/eslint-to-oxc.md` не трогаем (исторический документ).

## 4. Риски и как их снимаем

| Риск                                                                   | Вероятность    | Проверка/решение                                                       |
| ---------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------- |
| Rolldown-сборка иначе обрабатывает SCSS/ассеты (новая `sass-embedded`) | средняя        | `npm run build` + визуальная проверка `dist/spa` в `quasar dev`        |
| Нативный `resolve.tsconfigPaths` не читает `extends`                   | низкая         | если тесты падают — вернуть `vite-tsconfig-paths@6`                    |
| `vue-router` 5 несовместим с текущим кодом роутера                     | низкая         | release notes: breaking changes нет; `typecheck` + smoke-тесты страниц |
| `pinia` 4 требует `@vue/devtools-api`                                  | высокая (факт) | добавляем peer в `dependencies`                                        |
| `happy-dom` 21 меняет DOM-поведение в тестах                           | низкая         | полный прогон 76 тестов                                                |
| TypeScript 7 ломает `vue-tsc`                                          | **факт**       | не обновляем TS                                                        |
| `@quasar/extras` 2 ESM-only ломает импорт extras                       | низкая         | используем только `roboto-font`/`material-icons`, они есть в 2.1.0     |

## 5. Порядок выполнения

1. Ветка `chore/deps-and-quasar-v3`.
2. Обновить `package.json` (версии, engines, удалить `vite-tsconfig-paths`),
   `npm install`, `npm ls` на дубли Vite/Vue.
3. Механически заменить алиасы и обёртки, поправить `quasar.config.ts`,
   `env.d.ts`, `vitest.config.ts`, удалить `vite.config.ts`.
4. `npx quasar prepare` → `npm run typecheck` → `npm run lint` → `npm test`.
5. `npx quasar build` (SPA), проверить `dist/spa` и `publish.sh`-совместимость.
6. Обновить README/docs, заполнить раздел «Результат» в этом плане.
7. Коммит и пуш.

## 6. Критерии готовности

- [x] `npm ls vite` — одна версия Vite 8, без вложенных копий.
- [x] `npm run lint` — 0.
- [x] `npm run typecheck` — 0 (на TypeScript 5.9).
- [x] `npm test` — 8 файлов / 76 тестов зелёные.
- [x] `npx quasar build` — успешная SPA-сборка в `dist/spa`.
- [x] `npx quasar dev` — dev-сервер поднялся, `client-entry.js` компилируется.
- [x] В коде нет `quasar/wrappers`, `#q-app/wrappers`, `from 'src/`,
      `process.env` (кроме `publish.sh` и конфигов сборки).
- [x] README и docs соответствуют новым импортам и Node-требованиям.

## 7. Результат

### Версии

Установлено ровно то, что в плане: `@quasar/app-vite` 3.10.3, `@quasar/extras`
2.1.0, `@quasar/vite-plugin` 2.0.2, `quasar` 2.35.2, `vue` 3.5.44,
`vue-router` 5.4.0, `pinia` 4.1.0, `@vue/devtools-api` 8.2.1, `firebase` 13.2.0,
`zod` 4.6.7, `@types/node` 26.6.6, `happy-dom` 21.0.4, `vite-plugin-checker`
0.14.5, `vue-tsc` 3.3.14, `typescript` 5.9.3. `npm ls vite` — единственная
`vite@8.3.5`, вложенных копий нет.

### Что выяснилось по ходу (важное)

1. **Префикс env-переменных.** В `@quasar/app-vite` 3 клиентский префикс по
   умолчанию — `QCLI_`, а не `VITE_`. Без настройки все `import.meta.env.VITE_*`
   в браузере были бы `undefined` (типы при этом генерируются, но значения не
   подставляются). Добавлено:
   ```ts
   build: {
     env: {
       clientPrefix: 'VITE_',
     },
   }
   ```
   После `quasar prepare` все `VITE_*` попали в `ImportMetaEnv` как
   обязательные, а в собранном бандле — в объект-литерал (проверено: значения
   из `.env` и `.env.local` подставлены, `import.meta.env` строкой не остался).
2. **Вывод типов изменился.** `.env`-значения теперь типизируются по содержимому
   (`1004307719877` → `number`), а `FirebaseOptions.messagingSenderId` требует
   `string`. В `src/boot/firebase.ts` добавлен `String(...)`.
3. **Нативный `resolve.tsconfigPaths` в Vite 8 не разворачивает `extends`.**
   Корневой `tsconfig.json` только extends `.quasar/tsconfig.json`, поэтому
   `@/` в vitest не резолвился. Вместо возврата плагина `vite-tsconfig-paths`
   в `vitest.config.ts` задан явный алиас:
   ```ts
   resolve: {
     alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
   }
   ```
   Зависимость `vite-tsconfig-paths` удалена, предупреждение Vite ушло.

### Изменения в коде

- Обёртки: `defineConfig` из `#q-app`; `defineBoot` в `src/boot/auth.ts` и
  `src/boot/register-form-fields.ts`; `defineRouter` в `src/router/index.ts`;
  `defineStore` в `src/stores/index.ts`. `process.env.SERVER` →
  `import.meta.env.QUASAR_SERVER`.
- Алиасы: 143 замены `src/…` → `@/…` в `src/`, `test/` и `docs/`, плюс 9
  динамических `import('layouts/…')` / `import('pages/…')` в
  `src/router/routes.ts` (их не покрывал первый проход — их поймал `quasar
  build`).
- `quasar.config.ts`: `build.target.node` → `node22`, удалены неиспользуемые
  блоки `ssr`, `pwa`, `electron`, `cordova`, `capacitor`, `bex` и мёртвые
  комментарии про удалённые в v3 опции.
- Удалены `vite.config.ts` (не использовался) и `src/env.d.ts` (типы `VITE_*`
  теперь генерирует Quasar).
- `publish.sh`: `quasar build` → `npm run build`, `quasar clean` →
  `npx quasar clean` (глобального `quasar` в PATH нет, локальный CLI надёжнее).
- README: требования к Node, команда сборки, конвенции `@/` и `#q-app`.

### Проверки

| Команда                  | Результат                                               |
| ------------------------ | ------------------------------------------------------- |
| `npm run lint`           | ✅ 0 (oxlint type-aware + stylelint + oxfmt + атрибуты) |
| `npm run typecheck`      | ✅ 0 ошибок (TypeScript 5.9.3)                          |
| `npm test`               | ✅ 8 файлов / 76 тестов                                 |
| `npx quasar build`       | ✅ SPA-сборка, `dist/spa`                               |
| `npx quasar dev -p 9123` | ✅ HTTP 200, `client-entry.js` компилируется            |

### Регрессия: иконки отображались текстом (`menu_open`)

**Симптом.** После обновления вместо глифов Material Icons в разметке был
виден текст: `menu_open`, `person_add`, `dark_mode` и т.д.

**Причина.** В Quasar 2.35 переработан `QIcon`: лигатура иконки больше не
текстовый узел внутри `<i class="q-icon material-icons">`, а вложенный
`<span aria-hidden="true">menu_open</span>` (сделано ради доступности —
чтобы имя иконки не попадало в дерево доступности). А в
`src/css/_global.scss` был универсальный селектор:

```scss
* {
  font-family: Roboto, sans-serif;
}
```

Универсальный `*` перебивал наследование для этого `<span>`, поэтому
`font-family: 'Material Icons'` + `font-feature-settings: 'liga'` с `<i>` на
текст не действовали, и браузер рисовал имя иконки шрифтом Roboto.

Подтверждено через headless Chrome + CDP: у спана `font-family: Roboto,
sans-serif`, ширина 60 px (текст); после правки — `"Material Icons"`,
24 px (глиф). CSS, шрифт и `@font-face` при этом были в порядке — проблема
была только в каскаде.

**Правка.** Из `src/css/_global.scss` убран `font-family` из `*`
(шрифт body и так задаёт типографика Quasar), остался только
`scrollbar-width: thin`. В файле оставлен комментарий-предупреждение,
чтобы правило не вернули.

**Проверки после правки:**

| Команда                        | Результат                                      |
| ------------------------------ | ---------------------------------------------- |
| `npm run lint`                 | ✅ 0                                           |
| `npm run typecheck`            | ✅ 0 ошибок                                    |
| `npm test`                     | ✅ 8 файлов / 76 тестов                        |
| `npx quasar build`             | ✅ SPA-сборка, `dist/spa`                      |
| `quasar dev` + headless Chrome | ✅ глифы (скриншот, computed `Material Icons`) |
| прод-сборка на статик-сервере  | ✅ глифы (скриншот `dist/spa`)                 |

### Что осталось за рамками

- `typescript` 7 не обновлялся: пакет v7 — нативная реализация без
  классического Compiler API, `vue-tsc` на нём не работает (проверено по
  составу пакета: `main: null`, только `unstable/*` и бинарник `tsc`).
- Предупреждение Rolldown про чанки > 500 kB — существовавшая проблема
  размера бандла, к миграции не относится.
