# Employee form: named access example

В этом проекте мы отказались от обращения к полям формы по индексам массива и используем доступ по имени через утилиты из `src/utils/form.ts`. Это делает код стабильнее при изменении порядка полей.

## Ключевые помощники

- `getFieldModel(fields, name)` — возвращает сырое значение `model` по имени поля (может быть строкой/числом/`null`).
- `getFieldString(fields, name, fallback?)` — возвращает строковое значение с безопасным фолбеком (по умолчанию пустая строка).
- `toFormDataMap(fields)` — преобразует массив полей в объект `name -> value`.

## Пример: страница создания сотрудника

Ниже показан фрагмент логики из `src/pages/employee/NewEmployeePage.vue`, где все значения берутся по имени, а не по индексу:

```ts
import { getFieldString } from 'src/utils/form'

// ... внутри обработчика submit
const name = getFieldString(employeeFormRef, 'fio')
const email = getFieldString(employeeFormRef, 'login')
const position = getFieldString(employeeFormRef, 'position')
const level = getFieldString(employeeFormRef, 'level')
const rate = getFieldString(employeeFormRef, 'rate')
const description = getFieldString(employeeFormRef, 'description')

await addDoc(collection(db, 'employees'), {
  name,
  email,
  position,
  level,
  rate: Number(rate) || 0,
  description,
})
```

## Советы

- Не опирайтесь на порядок полей. Используйте `name` как контракт между схемой и обработчиком.
- Для чисел применяйте `Number(getFieldString(...))` или берите сырое значение через `getFieldModel` и валидируйте тип.
- Для кастомной сериализации формы можно использовать `toFormDataMap(fields)` и далее маппить значения в нужную модель данных.

## Типизированный submit и DTO

Ниже — пример лёгкой типизации submit: получаем данные формы, приводим в DTO для сохранения.

```ts
type NewEmployeeDTO = {
  name: string
  email: string
  position: string
  level: string
  rate: number
  description: string
}

function buildNewEmployeeDTO(fields: Ref<Fields> | Fields): NewEmployeeDTO {
  // вариант 1: точечно через getFieldString
  return {
    name: getFieldString(fields, 'fio'),
    email: getFieldString(fields, 'login'),
    position: getFieldString(fields, 'position'),
    level: getFieldString(fields, 'level'),
    rate: Number(getFieldString(fields, 'rate')) || 0,
    description: getFieldString(fields, 'description'),
  }
}

// вариант 2: собрать карту и маппить ключи (удобно при большом числе полей)
function buildNewEmployeeDTOviaMap(
  fields: Ref<Fields> | Fields
): NewEmployeeDTO {
  const m = toFormDataMap(fields)
  return {
    name: String(m.fio ?? ''),
    email: String(m.login ?? ''),
    position: String(m.position ?? ''),
    level: String(m.level ?? ''),
    rate: Number(m.rate ?? 0) || 0,
    description: String(m.description ?? ''),
  }
}

// использование в submit
async function onSubmit() {
  const dto = buildNewEmployeeDTO(employeeFormRef)
  await addDoc(collection(db, 'employees'), dto)
}
```
