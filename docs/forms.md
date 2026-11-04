# Формы: текущая архитектура

Статус: **актуально** (после фазы 4, см. `plan/architecture-improvements.md`).
Решение о единственном движке: `docs/adr/0002-legacy-form-engine.md`.

## Один движок

В проекте ровно один механизм форм:

```
Страница
  → useForm (состояние, валидация, submit/reset)
    → FormFields (рендер по FIELD_TYPE)
      → FormInput / FormSelect / FormTextArea / FormDatePicker
```

Никаких `BaseForm`, `SchemaForm`, реестров полей и schema-driven рендера нет.
Если понадобится второй движок, это отдельный ADR и отдельная миграция.

## Слои

| Слой          | Файлы                                                                                 | Ответственность                                                          |
| ------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Типы полей    | `src/shared/form/types.ts`                                                            | `FIELD_TYPE`, `INPUT_TYPE`, `AnyFormField`, `Fields`, `FieldModelByName` |
| Конфиги полей | `src/features/auth/model/formFields.ts`, `src/features/employees/model/formFields.ts` | фабрики, возвращающие свежий массив полей                                |
| Движок        | `src/shared/form/useForm.ts`                                                          | значения, `isValid`, `isSubmitting`, `errors`, `submit/reset`            |
| Рендер        | `src/shared/form/`                                                                    | `FormFields` + компоненты полей                                          |
| Валидация     | `src/validation/`                                                                     | zod-схемы, генерация Quasar rules, сбор ошибок                           |

Конфиги полей — это не стор: они не должны быть модульными синглтонами.
`createAuthFields(...)` и `createNewEmployeeFields()` создают новые объекты
при каждом вызове, поэтому две формы на странице не делят состояние.

## Валидация

Zod — единственный источник правил.

1. `src/validation/schemas.ts` описывает форму (`loginSchema`,
   `newEmployeeSchema`, …).
2. `rulesFromZodField(schema.shape.field)` превращает поле схемы в Quasar rule
   для мгновенной подсказки под конкретным полем.
3. `parseAndCollectErrors(schema, values)` валидирует форму целиком и отдаёт
   `Record<string, string[]>`.
4. `useForm` хранит эти ошибки в `errors`; страница передаёт их в
   `FormFields`, а компоненты полей показывают первую ошибку через
   `error`/`error-message`.

Если у формы есть `schema`, `useForm.validate()` не вызывает
`QForm.validate()` — иначе одна и та же проверка выполнялась бы дважды.
`QForm` остаётся только оболочкой для submit/reset событий.

## `useForm`: контракт

```ts
const {
  fields, // Ref<Fields> — значения полей
  formRef, // Ref<QForm | null>
  errors, // Ref<Record<string, string[]>>
  isValid, // Ref<boolean>
  isSubmitting, // Ref<boolean>
  validate, // () => Promise<boolean>
  reset, // () => Promise<void>
  submit, // () => Promise<void>
  setFieldValue, // типизировано по имени поля
  getFieldValue, // типизировано по имени поля
  getFormData, // () => Record<string, unknown>
} = useForm({
  fields: createAuthFields(AUTH_TYPE.LOGIN_EMAIL),
  schema: loginSchema,
  validateOnChange: true,
  onSubmit: async () => {
    // сценарий страницы
  },
})
```

`reset()`:

- берёт `defaultValue`, если он объявлен явно;
- для `SELECT` без `defaultValue` ставит `null`;
- для остальных полей — `''`;
- очищает `errors` и вызывает `resetValidation()` у `QForm`.

`validateOnChange` пересчитывает `errors` и `isValid` при изменении любого
поля. Это единственный watcher; второго механизма валидации нет.

## Пример страницы

```vue
<script setup lang="ts">
import EssentialForm from '@/shared/form/EssentialForm.vue'
import FormFields from '@/shared/form/FormFields.vue'
import { getFieldString } from '@/shared/form/access'
import { AUTH_TYPE, BUTTON_TYPE } from '@/shared/form/types'
import { useForm } from '@/shared/form/useForm'
import { AUTH_FIELD, createAuthFields, useAuthActions } from '@/features/auth'
import { loginSchema } from '@/validation/schemas'

const { login } = useAuthActions()

const { fields, formRef, errors, reset, submit, isValid, isSubmitting } =
  useForm({
    fields: createAuthFields(AUTH_TYPE.LOGIN_EMAIL),
    schema: loginSchema,
    validateOnChange: true,
    onSubmit: async () => {
      const email = getFieldString(fields, AUTH_FIELD.LOGIN)
      const password = getFieldString(fields, AUTH_FIELD.PASSWORD)

      if (await login(email, password)) {
        await reset()
      }
    },
  })
</script>

<template>
  <q-form
    ref="formRef"
    @reset="reset"
    @submit.prevent="submit"
  >
    <EssentialForm title="Вход">
      <template #fields>
        <FormFields
          :errors="errors"
          :fields="fields"
        />
      </template>

      <template #buttons>
        <q-btn
          :disable="!isValid"
          :loading="isSubmitting"
          :type="BUTTON_TYPE.SUBMIT"
          label="Войти"
          color="primary"
        />
      </template>
    </EssentialForm>
  </q-form>
</template>
```

## Доступ к значениям

Не полагайтесь на индекс поля — используйте имя:

- `getFieldModel(fields, name)` — сырое значение (`string | number | null`);
- `getFieldString(fields, name, fallback?)` — безопасная строка;
- `toFormDataMap(fields)` — карта `name → value`.

Имена полей auth и сотрудника зафиксированы в
`src/features/auth/model/fields.ts` (`AUTH_FIELD`) и
`src/features/employees/model/fields.ts` (`EMPLOYEE_FIELD`).

## Добавление поля

1. Добавьте поле в zod-схему в `src/validation/schemas.ts`.
2. Добавьте объект в фабрику (`features/auth/model/formFields.ts` или
   `features/employees/model/formFields.ts`):
   `fieldType`, `name`, `label`, `model`, `rule: rulesFromZodField(schema.shape.name)`.
3. Если тип поля новый — добавьте его в `FIELD_TYPE`,
   `src/shared/form/types.ts` и `FormFields.vue`.
4. Страница читает значение по имени, а не по индексу.

## Что удалено в фазе 3

- `components/BaseForm.vue`, `components/SchemaForm.vue`;
- `components/form-fields/registry.ts` и boot-регистрация
  `boot/register-form-fields.ts`;
- `types/form.schema.ts`, `schemas/login.schema.ts`;
- `types/form-dto.ts`;
- legacy-массивы правил `requiredInput`, `requiredSelect`, `word`, `email`,
  `password`, `phone`, `date` из `validation/rules.ts`;
- `_base-form.scss` и его подключение.

`MESSAGES` и `REGEXP` в `validation/rules.ts` остались: они используются
zod-хелперами и являются единым словарём сообщений/регулярок.

## Тесты

- `test/vitest/__tests__/form-useForm.spec.ts` — изоляция экземпляров,
  reset/defaultValue, очистка ошибок;
- `test/vitest/__tests__/form-utils.spec.ts` — доступ к значениям по имени;
- `test/vitest/__tests__/form-errors.spec.ts` — рендер zod-ошибок под полем;
- `test/vitest/__tests__/auth-pages.happy.spec.ts` и
  `employee-new.smoke.spec.ts` — сценарии страниц.
