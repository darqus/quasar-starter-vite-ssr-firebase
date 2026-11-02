# quasar-starter-vite-ssr-firebase (quasar-starter-vite-ssr-firebase)

quasar-starter-vite-ssr-firebase

## Demo

Live: [https://skill-flash.web.app](https://skill-flash.web.app)

## Documentation

- Forms: named access pattern — see `docs/employee-form-example.md`
- Auth forms: typed submit examples — see `docs/auth-form-examples.md`
- Stores migration to Composition API — see `docs/StoresMigration.md`

## Requirements

- Node.js `22.22+`, `24`, `26`, `28` or `30`
- npm 6.13.4+

## Install the dependencies

```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
npm run dev
```

### Lint the files

```bash
npm run lint
```

`lint` runs Oxlint, checks the Oxfmt formatting, verifies the CSS/SCSS property
order with Stylelint, rejects `<style>` blocks in Vue components, and validates
the attribute order in Vue templates. The same checks can be fixed
automatically:

```bash
npm run fix
```

Only the Vue template attribute order:

```bash
npm run check:vue-attrs
npm run fix:vue-attrs
```

Oxlint does not parse Vue templates, so the order is enforced by a project
script, `scripts/check-vue-attribute-order.mjs`:

`DEFINITION → LIST_RENDERING → CONDITIONALS → RENDER_MODIFIERS → GLOBAL →
[UNIQUE, SLOT] → TWO_WAY_BINDING → OTHER_DIRECTIVES → ATTR_DYNAMIC →
ATTR_STATIC → ATTR_SHORTHAND_BOOL → EVENTS → CONTENT`, alphabetically inside a
group. Tags with `v-bind="object"`, `v-pre`, or repeated attribute targets
(except `class`/`style`) are reported only and fixed manually.

In VS Code the fixer runs on save through the Run On Save extension
(`emeraldwalk.runonsave` in `.vscode/settings.json`); without that extension
the `lint` gate still applies.

### Format the files

```bash
npm run format
```

### Build the app for production

```bash
npm run build
```

### Styles

Styles live in SCSS modules under `src/css/`, one `_<component>.scss` partial
per component, inside the cascade layers declared in `_reset.scss`. Vue
components never contain `<style>` blocks — `npm run lint` fails if one is
added (`scripts/check-no-style-blocks.mjs`).

Design tokens are generated from `tokens/app.json`:

```bash
npm run build:tokens
```

`src/css/_tokens.scss` is a committed artifact; edit the JSON source and
re-run the script instead of touching the SCSS file. The full rules (layers,
tokens, BEM, Quasar overrides) are in `src/css/STYLE_GUIDE.md`.

### Project conventions

- Source imports use the `@/` alias, which Quasar CLI maps to `/src`:
  `import { useForm } from '@/composables/useForm'`.
- Quasar wrappers come from `#q-app`: `defineBoot` for boot files,
  `defineRouter` for the router and `defineStore` for the Pinia instance.
- Environment variables are read from `import.meta.env` (all `VITE_*`
  variables are typed automatically in `.quasar/quasar.d.ts`).
- Component styles are BEM blocks in `src/css/`, never `<style>` in an SFC.

### Customize the configuration

See [Configuring quasar.config.ts](https://quasar.dev/quasar-cli-vite/quasar-config-file).
