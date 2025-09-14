# Улучшенная архитектура форм в Quasar приложении

## Обзор

Новая архитектура форм предоставляет более гибкую и переиспользуемую систему для работы с формами в приложении на базе Quasar Framework.

## Структура архитектуры

### 1. Composable `useForm`

**Файл:** `src/composables/useForm.ts`

Основной хук для управления состоянием формы:

```typescript
const {
  fields,        // Реактивные поля формы
  formRef,       // Ссылка на QForm компонент
  isValid,       // Состояние валидации
  isSubmitting,  // Состояние отправки
  validate,      // Валидация формы
  reset,         // Сброс формы
  submit,        // Отправка формы
  setFieldValue, // Установка значения поля
  getFieldValue, // Получение значения поля
  getFormData,   // Получение всех данных формы
  updateField,   // Обновление поля
  addField,      // Добавление поля
  removeField    // Удаление поля
} = useForm({
  fields: formFields,
  onSubmit: handleSubmit,
  onReset: handleReset,
  validateOnChange: true
})
```

### 2. Компонент `BaseForm`

**Файл:** `src/components/BaseForm.vue`

Универсальный компонент формы с богатыми возможностями кастомизации:

```vue
<BaseForm
  v-model:valid="isFormValid"
  :fields="formFields"
  title="Заголовок формы"
  subtitle="Подзаголовок"
  submit-button-label="Отправить"
  :on-submit="handleSubmit"
  :on-reset="handleReset"
  show-card
  card-class="q-mt-md"
>
  <template #before-fields>
    <!-- Контент перед полями -->
  </template>

  <template #after-fields>
    <!-- Контент после полей -->
  </template>

  <template #actions="{ form }">
    <!-- Кастомные кнопки действий -->
  </template>
</BaseForm>
```

### 3. Компоненты полей формы

**Директория:** `src/components/form-fields/components/`

- `FormInput.vue` - текстовые поля
- `FormSelect.vue` - выпадающие списки
- `FormTextArea.vue` - многострочные текстовые поля
- `FormDatePicker.vue` - поля для выбора даты

Все компоненты следуют принципам Quasar и поддерживают:

- Proper v-model handling
- Lazy validation
- Bottom slots для ошибок
- Иконки и дополнительные настройки

### 4. Конфигурация полей

**Файлы:** `src/stores/authForms.ts`, `src/stores/employeeForms.ts`

Централизованное управление конфигурацией полей форм:

```typescript
const formFields: Fields = [
  {
    id: generateId(),
    fieldType: FIELD_TYPE.INPUT,
    name: 'email',
    label: 'Email',
    inputType: INPUT_TYPE.EMAIL,
    model: '',
    required: true,
    iconPrepend: 'email',
    rule: [...requiredInput, ...email]
  }
]
```

## Преимущества новой архитектуры

### 1. Переиспользуемость

- Единый `useForm` composable для всех форм
- Базовый компонент `BaseForm` с гибкими настройками
- Унифицированные компоненты полей

### 2. Типобезопасность

- Полная типизация TypeScript
- Строгие типы для полей и их значений
- IntelliSense поддержка

### 3. Гибкость

- Настраиваемые слоты для кастомного контента
- Возможность переопределения кнопок действий
- Поддержка как карточного, так и простого отображения

### 4. Соответствие Quasar принципам

- Использование lazy-rules для оптимизации
- Правильная работа с bottom-slots
- Интеграция с QForm компонентом

### 5. Лучший DX (Developer Experience)

- Простая интеграция новых форм
- Минимальный boilerplate код
- Централизованное управление валидацией

## Миграция с существующей архитектуры

### Старый подход

```vue
<!-- Много дублированного кода -->
<EssentialForm>
  <template #form>
    <FormFields :fields="formFields" />
  </template>
  <template #actions>
    <!-- Повторяющаяся логика кнопок -->
  </template>
</EssentialForm>
```

### Новый подход

```vue
<!-- Лаконичный и гибкий -->
<BaseForm
  :fields="formFields"
  :on-submit="handleSubmit"
  title="Форма"
/>
```

## Примеры использования

### 1. Простая форма входа

```vue
<template>
  <BaseForm
    :fields="loginFields"
    title="Войти в систему"
    :on-submit="handleLogin"
  />
</template>

<script setup>
import { useForm } from 'src/composables/useForm'
import { getCurrentAuthFields } from 'src/stores/authForms'
import { AUTH_TYPE } from 'src/types/form'

const loginFields = getCurrentAuthFields(AUTH_TYPE.LOGIN_EMAIL)

const handleLogin = async (formData) => {
  // Логика входа
}
</script>
```

### 2. Форма с кастомными элементами

```vue
<template>
  <BaseForm
    :fields="registerFields"
    title="Регистрация"
    :on-submit="handleRegister"
  >
    <template #before-fields>
      <q-banner class="text-primary">
        Добро пожаловать!
      </q-banner>
    </template>

    <template #after-fields>
      <q-checkbox v-model="agreeTerms">
        Согласен с условиями
      </q-checkbox>
    </template>

    <template #actions="{ form }">
      <q-btn
        label="Регистрация"
        color="primary"
        @click="form.submit"
        :loading="form.isSubmitting.value"
        :disable="!form.isValid.value || !agreeTerms"
      />
    </template>
  </BaseForm>
</template>
```

### 3. Программное управление формой

```vue
<script setup>
const form = useForm({
  fields: myFields,
  onSubmit: handleSubmit
})

// Программное заполнение
form.setFieldValue('email', 'user@example.com')

// Получение данных
const formData = form.getFormData()

// Динамическое добавление поля
form.addField({
  id: 'newField',
  fieldType: FIELD_TYPE.INPUT,
  name: 'phone',
  label: 'Телефон',
  model: ''
})

// Валидация
const isValid = await form.validate()
</script>
```

## Заключение

Новая архитектура форм предоставляет:

- Более чистый и поддерживаемый код
- Лучшую переиспользуемость компонентов
- Гибкость для сложных сценариев использования
- Соответствие best practices Quasar Framework
- Улучшенный developer experience

Эта архитектура готова к продуктиву и может быть легко расширена для новых требований приложения.
