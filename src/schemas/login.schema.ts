import type { FormSchema } from '@/types/form.schema'

export const loginSchema: FormSchema<
  [
    { kind: 'input'; name: 'login'; inputType: 'email'; defaultValue: '' },
    {
      kind: 'input'
      name: 'password'
      inputType: 'password'
      defaultValue: ''
    },
  ]
> = {
  fields: [
    { kind: 'input', name: 'login', inputType: 'email', defaultValue: '' },
    {
      kind: 'input',
      name: 'password',
      inputType: 'password',
      defaultValue: '',
    },
  ],
  validateOn: ['submit'],
}
