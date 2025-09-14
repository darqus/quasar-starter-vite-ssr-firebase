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
