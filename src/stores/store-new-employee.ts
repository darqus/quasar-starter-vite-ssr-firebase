import { defineStore, } from 'pinia'

import { STORE_TYPES, } from '@/types/enums'
import type { TNewEmployeeState, } from '@/types/new-employee'

import { createNotify, } from '@/utils/notify'

import { NEW_EMPLOYEE_FORM, } from './employeeForms'

import { addDoc, } from '@/boot/firebase'

const getDefaultUserState = (): TNewEmployeeState => ({
  formEmployee: NEW_EMPLOYEE_FORM(),
  loading: false,
  valid: false,
})

export const useStoreNewEmployee = defineStore(STORE_TYPES.NEW_EMPLOYEE, {
  state: getDefaultUserState,
  getters: {
    disabledSubmitButton: (state) => !state.valid,
  },
  actions: {
    toggleLoading () {
      this.loading = !this.loading
    },
    setValidForm () {
      this.valid = true
    },
    unsetValidForm () {
      this.valid = false
    },
    add () {
      this.toggleLoading()
      addDoc('employees', {
        name: this.formEmployee[0].model,
        email: this.formEmployee[1].model,
        position: this.formEmployee[2].model,
        level: this.formEmployee[3].model,
        rate: this.formEmployee[4].model,
        description: this.formEmployee[5].model,
      })
        .then(() => {
          createNotify(`Сотрудник "${this.formEmployee[0].model}" добавлен`, 'green-4', 'how_to_reg')
          this.onReset()
        }
        )
        .catch((error) => {
          createNotify(error)
        })
        .finally(() => {
          this.toggleLoading()
        })
    },
    onReset () {
      this.$state = getDefaultUserState()
    },
  },
})
