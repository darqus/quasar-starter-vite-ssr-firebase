import { defineStore, } from 'pinia'

import { STORE_TYPES, } from '@/types/enums'
import { type Form, } from '@/types/models'
import type { TNewEmployeeState, } from '@/types/new-employee'

import { createNotify, } from '@/utils/notify'

import { addDoc, } from '@/boot/firebase'

const getDefaultUserState = (): TNewEmployeeState => ({
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
    add (newEmployeeForm: Form) {
      this.toggleLoading()
      addDoc('employees', {
        name: newEmployeeForm[0].model,
        email: newEmployeeForm[1].model,
        position: newEmployeeForm[2].model,
        level: newEmployeeForm[3].model,
        rate: newEmployeeForm[4].model,
        description: newEmployeeForm[5].model,
      })
        .then(() => {
          createNotify(`Сотрудник "${newEmployeeForm[0].model}" добавлен`, 'green-4', 'how_to_reg')
        }
        )
        .catch((error) => {
          createNotify(error)
        })
        .finally(() => {
          this.toggleLoading()
        })
    },
  },
})
