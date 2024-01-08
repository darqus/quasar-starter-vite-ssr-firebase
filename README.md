# quasar-starter-vite-ssr-firebase

Based on Vue 3 + vite, quasar, pinia, firebase

![Quasar Framework logo](https://cdn.quasar.dev/logo-v2/header.png)

## Documentaion

### Project Documentaion

See [Frontend]().

See [Figma]().

## Quasar Documentaion

See [Configuring quasar.config.js](https://quasar.dev/quasar-cli-vite/quasar-config-file).

See [Directory Structure](https://quasar.dev/quasar-cli-vite/directory-structure).

See [Boot files](https://quasar.dev/quasar-cli-vite/boot-files).

See [State management with Pinia](https://quasar.dev/quasar-cli-vite/state-management-with-pinia).

## Run Scripts

### Install the dependencies

```sh
$ yarn
# or
$ npm i
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```sh
$ yarn quasar dev
# or
$ npx quasar dev
```

### Start the app in development mode SSR (hot-code reloading, error reporting, etc.)

```sh
$ yarn quasar dev:ssr
# or
$ npx quasar dev:ssr
```

### Linting errors with ESLint

```sh
$ yarn lint:fix
# or
$ npm run lint:fix
```

### Compiles and minifies for production

```sh
$ yarn quasar build
# or
$ npx quasar build
```

## Tests

### With CLI

```sh
$ yarn vitest
# or
$ npx vitest
```

### For CI

```sh
$ yarn vitest run
# or
$ npx vitest run
```

## Build

### Build app in SPA mode

```sh
$ yarn build
# or
$ npx build
```

### Build app in SSR mode

```sh
$ yarn build:ssr
# or
$ npx build:ssr
```

### Build app in SSR mode with debug

```sh
$ yarn build:ssr:debug
# or
$ npx build:ssr:debug
```

### Check build spa

```sh
$ cd dist/spa
$ yarn quasar dev
# or
$ npx quasar dev
```

### Check build ssr

```sh
$ cd dist/ssr
$ npm run start
```

### Deploy to Firebase

```sh
$ yarn deploy:firebase
# or
$ npx deploy:firebase
```

### Upgrade dependencies

```sh
$ yarn upgrade:deps
# or
$ npx upgrade:deps
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js)

### Deploy you project to Firebase

```sh
$ yarn deploy
# or
$ npm run deploy
```

### Customize configuration

* See [Vite](https://vitejs.dev/config/)
* See [Vue CLI](https://cli.vuejs.org/config/)

## Firebase

### Initial Firebase

* See [Initial Firebase](https://firebase.google.com/docs/hosting/quickstart#initialize)

install firebase tools
```sh
$ npm i -g firebase-tools
# or (*nix like)
$ curl -sL https://firebase.tools | bash

```

initial repo
```sh
$ npm init
$ npm install --save firebase
# or
$ yarn add firebase
```

login to firebase
```sh
$ firebase login
```

add alias to project
```sh
$ firebase use --add
```

? What alias do you want to use for this project? (e.g. staging)
type your alias in console

### Hosting

* See [Link](https://console.firebase.google.com/project/skill-flash/hosting/sites/skill-flash)

click button "Get started"

```sh
$ firebase init hosting
```

### "Don't set up a default project"

* ? Are you ready to proceed? Yes

* ? What do you want to use as your public directory? dist/spa
* ? Configure as a single-page app (rewrite all urls to /index.html)? Yes
* ? Set up automatic builds and deploys with GitHub? No

```sh
$ firebase emulators:start
```

```sh
$ firebase deploy --only hosting
$ firebase deploy --only hosting:skill-flash --project skill-flash
```

if you have deploy troubles

```sh
$ firebase logout
$ firebase login
```

### Local project firebase config, e.g. .env.local (see .env.local-example)

```ini
VITE_ADMIN_UIDS=["uid1", "uid2", "etc..."]

VITE_APP_API_KEY=
VITE_APP_AUTH_DOMAIN=
VITE_APP_PROJECT_ID=
VITE_APP_STORAGE_BUCKET=
VITE_APP_MESSAGING_SENDER_ID=
VITE_APP_APP_ID=
```

Fill it from your Firebase project settings and save to .env.local

VITE_ADMIN_UIDS - array of uids blog admins

* See [Upgrade from version 8 to the modular Web SDK](https://firebase.google.com/docs/web/modular-upgrade)

* See [Upgrade from version 8 to the modular Web SDK](https://firebase.google.com/docs/web/modular-upgrade#update_imports_to_v9_compat)

* See [Firebase Project Console](https://console.firebase.google.com/project/fireblogquasar/overview)

* See [Firebase Security Rules](https://firebase.google.com/docs/rules/simulator)

### Material Design Icons

* See [Material Icons](https://fonts.google.com/icons?selected=Material+Icons)

### Yarn interactive update deps

```sh
$ yarn upgrade-interactive
```

### Clean cache

```sh
$ yarn cache clean
```

### Demo preview

* See [Firebase Hosting URL1](https://skill-flash.web.app/)
* See [Firebase Hosting URL2](https://skill-flash.firebaseapp.com/)
