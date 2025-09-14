# Формы 2.0 — гибкая, масштабируемая архитектура

Этот документ описывает целевую архитектуру форм, совместимую с Quasar, с упором на расширяемость, типобезопасность и удобство использования. Предлагается поэтапная миграция от текущего состояния к схеме-ориентированному движку форм.

## Зачем менять

Болевые точки текущего решения:

- Дублирование рендера полей в `BaseForm` и `FormFields` (ветвление по `FIELD_TYPE`).
- Отсутствие реактивной валидации по `validateOnChange` (опция есть, но не применяется).
- Нет условной логики (поля «видимы/доступны, если…»), нет вычисляемых/зависимых полей.
- Нет массивов/повторителей (динамические списки элементов формы).
- Ограниченный выбор типов полей и жёсткая связка компонентов с перечислением `FIELD_TYPE`.
- Валидация распределена через Quasar rules, нет единого схемного слоя с кросс-полевыми зависимостями и трансформациями.
- Отсутствует поддержка i18n-ключей для меток/сообщений.
- Reset не уважает «дефолтные значения», только пустые строки/`null`.

## Цели

- Схема-ориентированная декларация форм (schema-driven), единый движок рендера.
- Расширяемость через реестр полей (field registry) и плагины.
- Типобезопасность: выведение формы данных из схемы, строгие имена полей.
- Условная логика, вычисляемые свойства, кросс-полевая валидация.
- Асинхронные источники данных (select options, зависимые списки).
- Поддержка массивов/повторителей и групп (fieldset/stepper/wizard).
- i18n: `labelKey`, `placeholderKey`, сообщения ошибок через ключи.
- Единый API: контролируемая/неконтролируемая форма, reset к дефолтам.

## Ключевые концепции

### 1) Схема формы

```ts
// src/types/form.schema.ts (планируемое)
import type { ZodTypeAny } from 'zod'

export type ConditionCtx<Shape extends Record<string, unknown>> = {
  values: Shape
}

export type Condition<Shape extends Record<string, unknown>> =
  | boolean
  | ((ctx: ConditionCtx<Shape>) => boolean)

export type DataSourceResult<V> = readonly Array<
  V | { label: string; value: V }
>
export type DataSource<V, Shape extends Record<string, unknown>> =
  | DataSourceResult<V>
  | ((
      ctx: ConditionCtx<Shape>
    ) => Promise<DataSourceResult<V>> | DataSourceResult<V>)

export type BaseField<Name extends string, Model> = {
  id?: string
  name: Name
  label?: string
  labelKey?: string
  placeholder?: string
  placeholderKey?: string
  defaultValue?: Model
  visible?: Condition<any>
  disabled?: Condition<any>
  // Атрибуты layout (grid)
  col?: number // 1..12
}

export type InputField<Name extends string> = BaseField<Name, string> & {
  kind: 'input'
  inputType?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'search'
    | 'url'
  mask?: string
}

export type TextareaField<Name extends string> = BaseField<Name, string> & {
  kind: 'textarea'
  autogrow?: boolean
}

export type SelectField<Name extends string, V = string | number> = BaseField<
  Name,
  V | null
> & {
  kind: 'select'
  options: DataSource<V, any>
}

export type DateField<Name extends string> = BaseField<Name, string> & {
  kind: 'date'
  mask?: string // формат отображения
}

export type ArrayField<
  Name extends string,
  Item extends FieldAny,
  Shape,
> = BaseField<Name, Array<any>> & {
  kind: 'array'
  of: Item[] // схема элементов, как минимум один
  min?: number
  max?: number
  // Кнопки add/remove можно настраивать
}

export type FieldAny =
  | InputField<any>
  | TextareaField<any>
  | SelectField<any, any>
  | DateField<any>
  | ArrayField<any, any, any>

export type FormSchema<
  Fields extends readonly FieldAny[],
  Shape extends Record<string, unknown>,
> = {
  fields: Fields
  // Валидация — единая схема (zod), опционально маппер DTO
  validation?: ZodTypeAny
  // Триггеры валидации
  validateOn?: Array<'submit' | 'change' | 'blur'>
}
```

- Схема отделяет «что рисовать и как валидировать» от «как рендерить».
- `visible`/`disabled` принимают boolean или функцию от текущих значений.
- `DataSource` позволяет указывать синхронные/асинхронные источники.
- `ArrayField` открывает путь к динамическим спискам.

### 2) Реестр полей (Field Registry)

```ts
// src/components/form-fields/registry.ts (планируемое)
import type { Component } from 'vue'

export type FieldRenderer = {
  component: Component
  // Опционально: адаптер пропсов для унификации пропов между схемой и компонентом Quasar
  mapProps?: (schemaField: any) => Record<string, unknown>
}

const registry = new Map<string, FieldRenderer>()

export function registerField(kind: string, renderer: FieldRenderer) {
  registry.set(kind, renderer)
}

export function resolveField(kind: string): FieldRenderer | undefined {
  return registry.get(kind)
}
```

- Позволяет подключать кастомные поля без изменения `BaseForm`.
- Маппер пропсов скрывает различия между схемой и реальным компонентом.

### 3) Единый движок рендера

```vue
<!-- src/components/SchemaForm.vue (планируемое) -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { FormSchema } from 'src/types/form.schema'
import { resolveField } from 'src/components/form-fields/registry'

const props = defineProps<{
  schema: FormSchema<any, any>
  modelValue?: Record<string, unknown>
}>()
const emit = defineEmits<{
  'update:modelValue': [Record<string, unknown>]
  submit: [Record<string, unknown>]
}>()

const values = ref<Record<string, unknown>>({})

// Инициализация дефолтов и внешней модели
onMounted(() => {
  for (const f of props.schema.fields) {
    values.value[f.name] =
      props.modelValue?.[f.name] ??
      f.defaultValue ??
      (f.kind === 'select' ? null : '')
  }
})

watch(
  () => props.modelValue,
  (ext) => {
    if (!ext) return
    Object.assign(values.value, ext)
  },
  { deep: true }
)

const visibleFields = computed(() =>
  props.schema.fields.filter((f) => {
    const cond =
      typeof f.visible === 'function'
        ? f.visible({ values: values.value })
        : f.visible
    return cond !== false
  })
)

const onSubmit = async () => {
  // здесь — валидация через schema.validation (zod)
  emit('submit', values.value)
}
</script>

<template>
  <q-form @submit.prevent="onSubmit">
    <div class="row q-col-gutter-md">
      <component
        v-for="f in visibleFields"
        :key="f.name"
        :is="resolveField(f.kind)?.component"
        v-model="values[f.name]"
        v-bind="resolveField(f.kind)?.mapProps?.(f) ?? f"
        :class="f.col ? `col-${f.col}` : 'col-12'"
      />
    </div>

    <slot name="actions" />
  </q-form>
</template>
```

- Движок читает схему и делегирует рендер реестру полей.
- Сетка (layout) декларативна через `col`.

### 4) Валидация (рекомендуется zod + адаптер)

- Единая точка истинны для правил. Пример для логина:

```ts
import { z } from 'zod'

export const loginValidation = z.object({
  login: z.string().email(),
  password: z.string().min(6),
})
```

- Можно написать адаптер, который конвертирует ошибки zod в формат, удобный для вывода под полем, или продолжать использовать `QInput` rules, но генерировать их из схемы.

### 5) Массивы/повторители

- `ArrayField` с кнопками «добавить/удалить», валидацией на min/max.
- Компонент `ArrayFieldRenderer` рендерит дочернюю схему для каждого элемента.

### 6) I18n

- В схеме вместо `label` можно хранить `labelKey`, а в маппере пропсов применять `t(labelKey)`.
- Сообщения об ошибках — также через i18n.

## Быстрые улучшения «здесь и сейчас» (минимальные правки)

1. Включить `validateOnChange` в текущем `useForm` через `watch` по `fields[].model` с `debounce`:
   - При изменении значений — триггерить `formRef.validate()` и обновлять `isValid`.
2. `reset()` должен использовать `defaultValue` (новое свойство поля), если оно задано.
3. Убрать дублирование рендера: перевести страницы с `FormFields` на `BaseForm` или общий «движок».
4. Стандартизировать `Select.options` до `Options<V>` (уже есть), отказаться от сырого `string[]`.
5. Добавить `visible?: boolean | (ctx) => boolean` и `disabled?: boolean | (ctx) => boolean` прямо в текущие типы полей — это даст условную логику без масштабной миграции.

## Пример схемы (Login)

```ts
import type { FormSchema } from 'src/types/form.schema'
import { z } from 'zod'

export const loginSchema: FormSchema<
  [
    {
      kind: 'input'
      name: 'login'
      inputType: 'email'
      labelKey: 'auth.email'
      defaultValue: ''
    },
    {
      kind: 'input'
      name: 'password'
      inputType: 'password'
      labelKey: 'auth.password'
      defaultValue: ''
    },
  ],
  { login: string; password: string }
> = {
  fields: [
    {
      kind: 'input',
      name: 'login',
      inputType: 'email',
      labelKey: 'auth.email',
      defaultValue: '',
    },
    {
      kind: 'input',
      name: 'password',
      inputType: 'password',
      labelKey: 'auth.password',
      defaultValue: '',
    },
  ],
  validation: z.object({
    login: z.string().email(),
    password: z.string().min(6),
  }),
  validateOn: ['submit', 'change'],
}
```

## План миграции по шагам

0. Совместное существование: оставить текущие формы и страницы без изменений.
1. Добавить «реестр полей» и новый компонент `SchemaForm.vue` (не ломая `BaseForm`). Зарегистрировать существующие `FormInput`, `FormSelect`, `FormTextArea`, `FormDatePicker`.
2. Добавить `form.schema.ts` и перенести одну форму (Login) на `SchemaForm` для апробации.
3. Добавить поддержку `visible/disabled` и (опционально) адаптер zod → ошибки под полями.
4. Внедрить `defaultValue` и поправить `reset` в `useForm`.
5. Расширить схему: массивы (`ArrayField`) и асинхронные `options` (Select).
6. Мигрировать остальные формы, удалить дублирующий `FormFields` после последней миграции.

## Риски и как их снять

- Рост сложности: прятать детали в реестре и мапперах пропсов.
- Типизация: начинать с простых явных типов, постепенно добавлять дженерики.
- Валидация: сначала оставить Quasar rules, параллельно вводить zod.

## Что даст результат

- Быстрая разработка новых форм без «ветвления» по типу поля.
- Гибкость: условные поля, массивы, зависимости, асинхронные источники данных.
- Единая валидация и типобезопасность.
- Уменьшение дублирования и улучшение читаемости кода.

---

Если нужна, могу добавить каркас `SchemaForm.vue`, `registry.ts` и `form.schema.ts` с регистрацией существующих полей — это займёт мало времени и не повлияет на текущие страницы.
