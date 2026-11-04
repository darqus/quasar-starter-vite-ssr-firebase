import { mount } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'

import { createAuthFields } from '@/features/auth'
import FormFields from '@/shared/form/FormFields.vue'
import { AUTH_TYPE } from '@/shared/form/types'

describe('FormFields schema errors', () => {
  it('renders zod errors under the matching fields', () => {
    const wrapper = mount(FormFields, {
      props: {
        fields: createAuthFields(AUTH_TYPE.LOGIN_EMAIL),
        errors: {
          login: ['Введите корректный email'],
          password: ['Введите пароль'],
        },
      },
    })

    expect(wrapper.text()).toContain('Введите корректный email')
    expect(wrapper.text()).toContain('Введите пароль')
    expect(wrapper.findAll('.q-field--error')).toHaveLength(2)
  })

  it('keeps fields clean when there are no errors', () => {
    const wrapper = mount(FormFields, {
      props: {
        fields: createAuthFields(AUTH_TYPE.LOGIN_EMAIL),
      },
    })

    expect(wrapper.findAll('.q-field--error')).toHaveLength(0)
  })
})
