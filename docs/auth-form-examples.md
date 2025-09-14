# Auth forms: typed submit examples

В этом документе — практические примеры типизированных submit для Login и Register, без обращения к полям по индексам. Вместо строк применяем константы имён полей для узких литеральных типов.

## Константы имён полей

См. `src/types/form-names.ts`:

```ts
export const AUTH_FIELD = { LOGIN: 'login', PASSWORD: 'password' } as const
export type AuthFieldName = (typeof AUTH_FIELD)[keyof typeof AUTH_FIELD]
```

## Типизированный submit: Login

```ts
import type { Ref } from 'vue'
import type { Fields } from 'src/types/form'
import { AUTH_FIELD } from 'src/types/form-names'
import { getFieldString } from 'src/utils/form'

function getAuthValue(fields: Ref<Fields> | Fields, name: AuthFieldName) {
  return getFieldString(fields, name)
}

async function onLoginSubmit(fields: Ref<Fields> | Fields) {
  const email = getAuthValue(fields, AUTH_FIELD.LOGIN)
  const password = getAuthValue(fields, AUTH_FIELD.PASSWORD)
  // signInWithEmailAndPassword(auth, email, password)
}
```

## Типизированный submit: Register

```ts
import type { Ref } from 'vue'
import type { Fields } from 'src/types/form'
import { AUTH_FIELD } from 'src/types/form-names'
import { getFieldString } from 'src/utils/form'

async function onRegisterSubmit(fields: Ref<Fields> | Fields) {
  const email = getFieldString(fields, AUTH_FIELD.LOGIN)
  const password = getFieldString(fields, AUTH_FIELD.PASSWORD)
  // createUserWithEmailAndPassword(auth, email, password)
}
```

## Полезные заметки

- Константы имён полей помогают избежать опечаток и упростить рефакторинг.
- При необходимости декларативной типизации всей формы можно дополнить типами DTO и маппингом через `toFormDataMap` — аналогично примеру в `employee-form-example.md`.
