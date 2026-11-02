# Миграция ESLint + Prettier → oxlint + oxfmt

Статус: **выполнено**
Дата: 2026-11-02
Проект: `quasar-starter-vite-ssr-firebase` (Quasar + Vite + Vue 3, npm)

## 1. Аудит

### 1.1. Что есть сейчас

| Инструмент            | Конфиг                                        | Зависимости                                                                                                                                    | Скрипты                 |
| --------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| ESLint 9 (flat)       | `eslint.config.js`, `.config/eslint-rules/**` | `eslint`, `@eslint/js`, `@vue/eslint-config-typescript`, `@vue/eslint-config-prettier`, `eslint-plugin-import`, `eslint-plugin-vue`, `globals` | `lint`                  |
| Prettier 3            | `.prettierrc.json`                            | `prettier`                                                                                                                                     | `format`                |
| Stylelint             | `.stylelintrc.json`                           | **зависимостей нет** (Stylelint не установлен и в `lint` не участвует)                                                                         | нет                     |
| `vite-plugin-checker` | `quasar.config.ts` (блок `eslint`)            | `vite-plugin-checker`                                                                                                                          | запускается в dev/build |

- `.vue`-файлов: **25** в `src/`.
- `node_modules` отсутствовал — зависимости ставятся заново (`npm install`).
- Менеджер пакетов переводится с yarn 1 на npm: `yarn.lock` удаляется,
  генерируется `package-lock.json`, команды в README — `npm run ...`.
- В `.vscode/settings.json` дефолтный форматтер — `esbenp.prettier-vscode`, на сохранении
  `source.fixAll.eslint` + `source.fixAll.prettier`; рекомендованы ESLint и Prettier.
- В `.github` только `.github/instructions/main.instructions.md`, папка целиком в
  `.gitignore` — CI-workflow в репозитории нет.
- `firebase-debug.log` — неотслеживаемый мусор, не трогаем.

### 1.2. Что из ESLint-правил реально теряется

ESLint в этом проекте делает две разные вещи:

1. **Форматирование** — полностью перекрывается oxfmt:
   `vue/max-attributes-per-line`, `vue/first-attribute-linebreak`,
   `vue/html-closing-bracket-newline`, `vue/html-indent`, `vue/block-tag-newline`,
   `vue/padding-line-between-blocks` (частично), `semi`, `quotes`, `indent` и т. п.
2. **Качество кода** — часть покрывается oxlint, часть нет.

Переносится в oxlint:

- `curly`, `eqeqeq`, `prefer-const`, `no-var`, `no-param-reassign`,
  `no-unused-expressions`, `object-shorthand`, `no-console`, `no-debugger`;
- `@typescript-eslint/consistent-type-definitions`, `consistent-type-imports`,
  `no-explicit-any`, `no-non-null-assertion`, `no-unused-vars`, `no-shadow`;
- базовые `correctness`/`suspicious` из коробки;
- `vue/*`: часть правил шаблонов поддерживается плагином `vue` в oxlint
  (`vue/no-unused-components`, `vue/no-v-html`, `vue/require-explicit-emits` и др. —
  уточняется по факту прогона).

**Type-aware правила переносятся** через `oxlint --type-aware` (пакет
`oxlint-tsgolint`): `no-floating-promises`, `no-misused-promises`, `prefer-readonly`,
`no-unnecessary-type-assertion`, `restrict-template-expressions`. Флаг добавлен в
`lint`/`fix`; прогон по проекту занимает ~1.2 с.

**Не переносится** (правила шаблонов и стиля, которых нет в oxlint или они
заменены форматтером):

- `vue/attributes-order` — заменяется собственным чекером (см. 2.2);
- `vue/attribute-hyphenation`, `vue/prop-name-casing`, `vue/order-in-components`,
  `vue/component-name-in-template-casing`, `vue/v-on-event-hyphenation`,
  `vue/require-default-prop`, `vue/no-unused-components`, `vue/no-v-html`;
- `import/order` + `sort-imports` — заменяются `sortImports` в oxfmt;
- `no-shadow`, `prefer-destructuring` (для `scripts/` отключено), `prefer-template`,
  `no-useless-constructor` и прочие «стилевые» правила ESLint;
- `@typescript-eslint/naming-convention` — в oxlint нет.

`vue-tsc --noEmit` остаётся и продолжает ловить типовые ошибки.

### 1.3. Ключевые замеры

- **Порядок атрибутов:** прогнал будущий чекер по всем 25 `.vue` —
  **0 нарушений**. То есть сортировать атрибуты не придётся, нужен только гейт.
- **Форматирование oxfmt:** при конфиге, смигрированном из `.prettierrc.json`,
  отличается от Prettier ровно в **1 файле** (`FormFields.vue`, перенос union-типа
  внутри `@update:model`). Т. е. переход на oxfmt почти не меняет вид кода.
- **Сортировка импортов:** с группами, повторяющими старый `import/order`
  (`vue` → external → `pinia`/`quasar` → `src/**` → relative), меняются импорты в
  **~14 файлах** (порядок `type`-импортов и пустые строки между группами).
  Без `sortImports` изменений было бы 0, но мы потеряли бы сортировку импортов.
- `database.rules.json` — это не JSON (Firebase rules), oxfmt на нём падает;
  файл нужно добавить в `ignorePatterns`.

## 2. План работ

### 2.1. Конфигурация oxc

- Добавить devDependencies `oxlint` и `oxfmt` (те же мажорные версии, что в `mylara`:
  `oxfmt ^0.75`, `oxlint ^1.90`).
- Создать `.oxfmtrc.json` на базе `oxfmt --migrate=prettier` от текущего
  `.prettierrc.json`:
  - `printWidth: 80`, `tabWidth: 2`, `semi: false`, `singleQuote: true`,
    `trailingComma: "es5"`, `singleAttributePerLine: true`;
  - override для `**/*.scss` — двойные кавычки (как было у Prettier);
  - `ignorePatterns`: `dist/`, `.quasar/`, `.firebase/`, `firebase-debug.log`,
    `package-lock.json`, `**/database.rules.json`, `**/*.min.*`;
  - `sortImports` с `internalPattern: ["src/"]` и группами, повторяющими прежний
    `import/order` (vue → external → pinia/quasar → internal `src/**` → relative),
    `newlinesBetween: true`, алфавит без учёта регистра.
- Создать `.oxlintrc.json`:
  - `plugins: ["eslint", "typescript", "unicorn", "oxc", "vue"]`;
  - `categories: { correctness: "error", suspicious: "warn" }`;
  - правила-аналоги перенесённых из ESLint (см. 1.2), в т. ч.
    `typescript/consistent-type-imports`, `typescript/consistent-type-definitions`,
    `typescript/no-non-null-assertion`, `eslint/curly`, `eslint/eqeqeq`,
    `eslint/prefer-const`, `no-console` с разрешёнными `warn`/`error`;
  - `ignorePatterns` для `dist`, `.quasar`, `.firebase`, `node_modules`.
- Прогнать `oxlint` и `oxfmt` по репозиторию; найденные замечания либо починить,
  либо точечно ослабить правило с комментарием-причиной.

### 2.2. Порядок атрибутов Vue (как в `fallback`/`mylara`)

- Скопировать без изменения логики:
  - `scripts/lib/vueAttributeOrder.mjs` — порт `vue/attributes-order`
    (строгий порядок групп + алфавит внутри группы);
  - `scripts/check-vue-attribute-order.mjs` — CLI (`check`/`--fix`, пути аргументами);
  - `scripts/lib/vueAttributeOrder.test.mjs` — 41 юнит-тест.
- `vitest.config.ts`: добавить `scripts/**/*.test.mjs` в `include`.
- `package.json`: `check:vue-attrs`, `fix:vue-attrs`; чекер включить в `lint` и `fix`.
- `.vscode/settings.json`: `emeraldwalk.runonsave` с командой
  `PATH="$HOME/.nvm/current/bin:$PATH" node "${workspaceFolder}/scripts/check-vue-attribute-order.mjs" --fix "${file}"`.
- `.vscode/extensions.json`: добавить `emeraldwalk.runonsave`.

### 2.3. Удаление ESLint и Prettier

- Удалить файлы: `eslint.config.js`, `.prettierrc.json`, `.config/eslint-rules/`
  (вся папка `.config`, если в ней больше ничего нет).
- Удалить из `package.json` devDependencies: `@eslint/js`, `eslint`,
  `@vue/eslint-config-prettier`, `@vue/eslint-config-typescript`,
  `eslint-plugin-import`, `eslint-plugin-vue`, `globals`, `prettier`.
- `quasar.config.ts`: убрать блок `eslint` из `vite-plugin-checker`, оставить
  `vueTsc: true`.
- Скрипты:
  - `lint` → `oxlint . && oxfmt --check && node scripts/check-vue-attribute-order.mjs`;
  - `fix` → `oxlint --fix . && oxfmt && node scripts/check-vue-attribute-order.mjs --fix`;
  - `format` → `oxfmt` (имя сохраняем, чтобы не ломать привычку и README).
- Убрать `eslint-disable`-комментарии:
  - `src/env.d.ts`, `src/stores/store-flag.d.ts` → `/* eslint-disable */` можно
    удалить (это сгенерированные/декларационные файлы, проверить после прогона);
  - `src/stores/index.ts` → `// eslint-disable-next-line @typescript-eslint/consistent-type-definitions`
    заменить на `// oxlint-disable-next-line typescript/consistent-type-definitions`
    (или убрать, если правило не срабатывает);
  - `test/vitest/__tests__/employee-new.smoke.spec.ts` → `/* eslint-disable import/order */`
    удалить (порядок теперь задаёт oxfmt).
- Обновить `README.md` (команды lint/format) и `docs/StoresMigration.md`
  (упоминание `eslint-plugin-import`).

### 2.4. VS Code

- `.vscode/settings.json` переписать:
  - `editor.defaultFormatter: "oxc.oxc-vscode"`;
  - `editor.codeActionsOnSave`: `source.fixAll.oxc: "always"` (+ `source.fixAll.stylelint`,
    если stylelint остаётся);
  - убрать все `eslint.*`, `[javascript|typescript|vue]` секции с Prettier;
  - добавить `emeraldwalk.runonsave` для `.vue`.
- `.vscode/extensions.json`: `oxc.oxc-vscode`, `vue.volar`,
  `stylelint.vscode-stylelint` (если stylelint остаётся), `emeraldwalk.runonsave`;
  убрать `dbaeumer.vscode-eslint` и `esbenp.prettier-vscode`.

### 2.5. Stylelint (требует решения)

`.stylelintrc.json` есть, расширение и настройки VS Code на него ссылаются, но
пакетов `stylelint` и конфигов в зависимостях нет — сейчас это мёртвая настройка.

Выбран вариант **A**: установлены `stylelint`, `stylelint-config-standard-scss`,
`stylelint-config-recess-order`, `postcss-scss`; `stylelint "src/**/*.{css,scss}"`
входит в `lint`, `--fix` — в `fix`.

### 2.6. Проверки

1. `npm run lint` — oxlint + stylelint + oxfmt `--check` + чекер атрибутов.
2. `npm run typecheck` — `vue-tsc --noEmit` (скрипт добавляется в `package.json`).
3. `npm test` — существующие 7 spec-файлов + 41 новый тест чекера.
4. Ручная проверка гейта: временный `.vue` с неверным порядком → `lint` падает,
   `fix:vue-attrs` переставляет.
5. `oxfmt --check` на чистом дереве — не должно быть диффа.

### 2.7. Коммиты

Один коммит (или два: «tooling» + «format») в `main` с пушем, как делали в
`fallback`/`mylara`. Если переформатирование затронет много файлов, отделю
механические изменения (`style: format with oxfmt`) от конфигурации.

## 3. Риски и ограничения

- **Потеря type-aware lint** — см. 1.2, компенсируется только `vue-tsc`.
- **Сортировка импортов** изменит ~14 файлов; это осознанный шаг, иначе
  `import/order` просто исчезнет.
- **oxfmt < Prettier по зрелости**: возможны редкие различия в переносах
  (пример — union-тип в `FormFields.vue`). Лечится `oxfmt`-форматированием.
- **Run On Save** — внешнее dev-расширение; без него гейт в `lint` продолжает
  работать, on-save просто не срабатывает.
- `.github` в `.gitignore` — CI не настраиваем.
- `database.rules.json` обязан быть в `ignorePatterns`, иначе oxfmt падает.

## 4. Чек-лист выполнения

- [x] `oxlint` + `oxfmt` в devDependencies, `.oxfmtrc.json`, `.oxlintrc.json`
- [x] ESLint/Prettier удалены (файлы, зависимости, скрипты, IDE-настройки)
- [x] `vite-plugin-checker` без ESLint
- [x] чекер атрибутов + тесты + скрипты + гейт в `lint`/`fix`
- [x] Run On Save в `.vscode`
- [x] stylelint: стек доустановлен, проверка в `lint`/`fix`
- [x] yarn → npm (`yarn.lock` удалён, `package-lock.json`, команды в README)
- [x] документация обновлена
- [x] `lint`, `typecheck`, `test` — зелёные
- [ ] коммит и пуш

## 5. Результат

- **Порядок атрибутов:** 0 нарушений на 25 `.vue`-файлах — шаблоны не менялись,
  добавлен только гейт и on-save.
- **Форматирование:** `oxfmt` переформатировал ~20 файлов; отличия от Prettier
  минимальны (union-тип в `FormFields.vue`, пустые строки в docs, финальные
  переводы строк). `oxfmt --check` на чистом дереве проходит.
- **Импорты:** `sortImports` переставил импорты в 14 файлах под прежний порядок
  (`vue` → external → `pinia`/`quasar` → `src/**` → relative).
- **Исходники:** `oxlint --fix` добавил фигурные скобки в 22 однострочных `if`
  (правило `curly` было в ESLint, но код его нарушал); убраны 4 лишних
  `as unknown as ...`; в `EssentialForm.vue` props с дефолтами сделаны
  опциональными (устраняет `vue/no-required-prop-with-default`).
- **Stylelint:** `--fix` отсортировал свойства в `_global.scss` и убрал лишние
  пустые строки в `quasar.variables.scss`.
- **Менеджер пакетов:** yarn 1 → npm; `yarn.lock` (5780 строк) удалён,
  сгенерирован `package-lock.json`; `.npmrc` с pnpm-опциями удалён (npm на них
  ругался), README переведён на `npm run ...`.
- **Vitest:** обновлён `3.2.7 → 5.1.0`. Причина: свежий `npm install` поднял
  `vite` до 8, а vitest 3 тянул вложенный vite 7 — `vue-tsc` падал на
  `vitest.config.ts` из-за несовместимых типов `Plugin`. На vitest 5 остаётся
  один vite 8, типы сходятся.
- **Проверки:** `npm run lint` — 0 (oxlint type-aware + stylelint + oxfmt +
  атрибуты), `npm run typecheck` — 0, `npm test` — 8 файлов / 76 тестов
  (35 старых + 41 тест чекера).
- **Гейт проверен вручную:** временный `Probe.vue` с неверным порядком → `lint`
  падает (код 1), `fix:vue-attrs` переставляет атрибуты.
