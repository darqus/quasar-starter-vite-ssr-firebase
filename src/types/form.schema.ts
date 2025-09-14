export type ConditionCtx = { values: Record<string, unknown> }

export type Condition = boolean | ((ctx: ConditionCtx) => boolean)

export type DataSourceResult<V> = Array<V | { label: string; value: V }>
export type DataSource<V> =
  | DataSourceResult<V>
  | ((ctx: ConditionCtx) => Promise<DataSourceResult<V>> | DataSourceResult<V>)

export type BaseField<Name extends string, Model> = {
  name: Name
  label?: string
  labelKey?: string
  placeholder?: string
  placeholderKey?: string
  defaultValue?: Model
  visible?: Condition
  disabled?: Condition
  col?: number
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
  options: DataSource<V>
}

export type DateField<Name extends string> = BaseField<Name, string> & {
  kind: 'date'
  mask?: string
}

export type FieldAny =
  | InputField<string>
  | TextareaField<string>
  | SelectField<string, unknown>
  | DateField<string>

export type FormSchema<Fields extends readonly FieldAny[]> = {
  fields: Fields
  validation?: unknown
  validateOn?: Array<'submit' | 'change' | 'blur'>
}
